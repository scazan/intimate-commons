"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RadioGroup, Button } from "@/components/base/ui";
import { Choice, Header2, Header3 } from "@/components";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "../base/ui/form";
import { useForm } from "react-hook-form";
import { addChoice } from "@/api";

export const QuestionForm = ({ choices, className }) => {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const offset = step * 4;
  const subject = choices[offset];

  const handleNext = async (values) => {
    console.log("would trade", subject.id, "for", values.object);

    const request = fetch("/api/v1/choices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subId: subject.id, objId: values.object }),
    });

    // const addedChoice = await addChoice({
    // userId: 1,
    // subId: subject.id,
    // objId: values.object,
    // });

    if (step === 3) {
      router.push("/results");
      return;
    }

    setStep((step) => step + 1);

    return false;
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    if (step === 0) {
      return;
    }

    setStep((step) => step - 1);

    return false;
  };

  const form = useForm<any>();

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

                    <Choice key="never" value="I would never." />
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

/*
* <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom">
            <Input
              type="text"
              placeholder="fill in an exchange of your choosing"
            />
          </Label>
        </div>
  */
