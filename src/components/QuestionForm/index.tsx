"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { RadioGroup, Button, Label, Input } from "@/components/base/ui";
import { Choice, Header2, Header3 } from "@/components";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "../base/ui/form";
import { useForm } from "react-hook-form";

export const QuestionForm = ({ choices, className }) => {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const offset = step * 4;
  const subject = choices[offset];
  console.log(choices);
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
        }),
      });

      choicesMade.push({
        subId: subject.id,
        objId,
      });
    }

    if (step === 3) {
      const choicesSearchParams = new URLSearchParams(choicesMade);
      router.push(`/results?${choicesSearchParams.toString()}`, {});
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
    </>
  );
};

export default QuestionForm;
