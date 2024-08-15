"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RadioGroup, Button, Input } from "@/components/base/ui";
import { Choice, Header2, Header3 } from "@/components";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "../base/ui/form";
import { useForm } from "react-hook-form";
import { LoadingCircle } from "../LoadingCircle";

export const QuestionForm = ({ choices, sessionId, className }) => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const offset = step * 4;
  const subject = choices[offset];
  const choicesMade = [];

  const handleNext = async (values) => {
    const isCustom = values.object === "custom";

    if (values.object !== "skip" && !(isCustom && !values.customInput)) {
      let objId = values.object;

      if (isCustom) {
        objId = values.customInput;
      }

      fetch("/api/v1/choices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // semantic triple
        body: JSON.stringify({
          subId: subject.id,
          objId,
          isCustom,
          sessionId,
        }),
      });

      choicesMade.push({
        subId: subject.id,
        objId,
      });
    }

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

  const handlePrevious = (e) => {
    e.preventDefault();
    if (step === 0) {
      return;
    }

    setStep((step) => step - 1);

    form.setValue("customInput", "");
    form.reset();
    return false;
  };

  let randomNumber = Math.random();

  useEffect(() => {
    randomNumber = Math.random();
  }, [step]);

  const form = useForm<any>({
    defaultValues: {
      object: "skip",
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
                        render={({ field }) => (
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
                                    );
                                  // @ts-ignore
                                  customInput.click();
                                }}
                              />
                            </FormControl>
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
            >
              Previous
            </Button>
            <Button variant="large" type="submit">
              Next
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
