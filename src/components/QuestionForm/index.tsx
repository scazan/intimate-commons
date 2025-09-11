"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RadioGroup, Button, Input } from "@/components/base/ui";
import { Choice, Header2, Header3 } from "@/components";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../base/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingCircle } from "../LoadingCircle";
import { questionFormSchema, type QuestionFormData } from "@/lib/validation/schemas";
import { apiCall, getErrorMessage, retryWithBackoff, APIError, NetworkError, ValidationError } from "@/lib/errors";
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus";

interface QuestionFormProps {
  choices: Array<{ id: string; title: string }>;
  sessionId: string;
  className?: string;
}

export const QuestionForm = ({ choices, sessionId, className }: QuestionFormProps) => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOnline = useNetworkStatus();

  const offset = step * 4;
  const subject = choices[offset];
  const choicesMade = [];

  const handleNext = async (values: QuestionFormData) => {
    const isCustom = values.object === "custom";
    setIsSubmitting(true);
    
    // Clear any previous errors
    form.clearErrors("root");

    // Check if offline
    if (!isOnline) {
      form.setError("root", {
        type: "manual",
        message: "You're currently offline. Please check your internet connection and try again.",
      });
      setIsSubmitting(false);
      return;
    }

    if (values.object !== "skip" && !(isCustom && !values.customInput)) {
      let objId = values.object;

      if (isCustom) {
        objId = values.customInput!;
      }

      try {
        await retryWithBackoff(async () => {
          return await apiCall("/api/v1/choices", {
            method: "POST",
            body: JSON.stringify({
              subId: subject.id,
              objId,
              isCustom,
              sessionId,
            }),
          });
        });

        choicesMade.push({
          subId: subject.id,
          objId,
        });
      } catch (error) {
        console.error("Error submitting choice:", error);
        
        let errorMessage = getErrorMessage(error);
        
        // Provide more specific error messages
        if (error instanceof NetworkError) {
          errorMessage = "Connection failed. Please check your internet connection and try again.";
        } else if (error instanceof ValidationError) {
          errorMessage = "Please check your input and try again.";
        } else if (error instanceof APIError) {
          if (error.statusCode === 429) {
            errorMessage = "Too many requests. Please wait a moment and try again.";
          } else if (error.statusCode >= 500) {
            errorMessage = "Server error. Please try again in a moment.";
          }
        }

        form.setError("root", {
          type: "manual",
          message: errorMessage,
        });
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);

    if (step === 3) {
      const serializableChoices = choicesMade.reduce((accum, choice, i) => {
        accum[`o${i}`] = choice.objId;
        accum[`s${i}`] = choice.subId;

        return accum;
      }, {});
      const choicesSearchParams = new URLSearchParams(serializableChoices);
      setIsLoading(true);

      router.push(
        `/results?sid=${sessionId}&${choicesSearchParams.toString()}`,
        {},
      );
      return;
    }

    setStep((step) => step + 1);

    form.setValue("customInput", "");
    form.setValue("object", "skip");
    form.reset();
    // bit of a hack as react-form is not clearing the input state on the component itself
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      button.dataset.state = "";
      button.ariaChecked = "false";
    });
    return false;
  };

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step === 0) {
      return;
    }

    setStep((step) => step - 1);

    form.setValue("customInput", "");
    form.reset();
    return false;
  };

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      object: "skip",
      customInput: "",
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.setValue("customInput", "");
      form.reset({ object: "skip" });
    }
  }, [form.formState]);

  return (
    <>
      <Header2>QUESTION {step + 1} OF 5</Header2>
      <Header3>
        Would you share your {subject.title.toUpperCase()} in exchange for…
      </Header3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleNext)}
          className={cn(className, "flex flex-col justify-center items-center")}
        >
          <FormField
            control={form.control}
            name="object"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {choices.slice(offset + 1, offset + 3).map((choice) => (
                      <Choice
                        key={choice.id}
                        label={choice.title}
                        value={choice.id}
                      />
                    ))}

                    <Choice value="custom" label="">
                      <FormField
                        control={form.control}
                        name="customInput"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="text"
                                variant="unstyled"
                                placeholder="fill in an exchange of your choosing"
                                {...field}
                                onFocusCapture={() => {
                                  const customInput =
                                    document.body.querySelector(
                                      "button[value=custom]",
                                    ) as HTMLButtonElement;
                                  customInput?.click();
                                }}
                              />
                            </FormControl>
                            {fieldState.error && (
                              <FormMessage>{fieldState.error.message}</FormMessage>
                            )}
                          </FormItem>
                        )}
                      />
                    </Choice>
                    <Choice value="never" label="I would never." />
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          {!isOnline && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm mt-2">
              ⚠️ You're currently offline. Please check your internet connection.
            </div>
          )}

          {form.formState.errors.root && (
            <div className="text-red-500 text-sm mt-2">
              {form.formState.errors.root.message}
            </div>
          )}

          <div
            className={cn(
              "flex justify-between items-center w-full py-7",
              step === 0 ? "justify-center" : "justify-between",
            )}
          >
            <Button
              variant="large"
              type="button"
              onClick={handlePrevious}
              className={cn(step === 0 && "hidden")}
              disabled={isSubmitting}
            >
              Previous
            </Button>
            <Button 
              variant="large" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingCircle className="w-5 h-5" /> : "Next"}
            </Button>
          </div>
        </form>
      </Form>
      {isLoading && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-white opacity-30 z-50">
          <LoadingCircle className="w-20 h-20" />
        </div>
      )}
    </>
  );
};

export default QuestionForm;
