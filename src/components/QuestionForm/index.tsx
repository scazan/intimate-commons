"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { RadioGroup, Button, Input } from "@/components/base/ui";
import { Choice, Header2, Header3 } from "@/components";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "../base/ui/form";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";

export const QuestionForm = ({ choices, sessionId, className }) => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const offset = step * 4;
  const subject = choices[offset];
  const choicesMade = [];

  const handleNext = async (values) => {
    if (values.object !== "skip") {
      let objId = values.object;
      const isCustom = values.object === "custom";

      if (isCustom) {
        objId = values.customInput;
      }

      fetch("/api/v1/choices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

    form.reset();
    form.setValue("customInput", "");
    return false;
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    if (step === 0) {
      return;
    }

    setStep((step) => step - 1);

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
        <div className="flex justify-center items-center fixed w-screen h-screen bg-white opacity-30 z-50">
          <LoadingCircle className="w-20 h-20" />
        </div>
      )}
    </>
  );
};

function LoadingCircle({
  dimensions,
  className,
}: {
  dimensions?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn(`${dimensions} animate-spin`, className)}
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );
}

export default QuestionForm;
