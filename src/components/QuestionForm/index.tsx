"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RadioGroup, Button } from "@/components/base/ui";
import { Choice, Header2, Header3 } from "@/components";
import { cn } from "@/lib/utils";
import { Form } from "../base/ui/form";
import { useForm } from "react-hook-form";

export const QuestionForm = ({ choices, className }) => {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const offset = step * 4;

  const handleNext = (e) => {
    e.preventDefault();
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
        Would you share your {choices[offset].title.toUpperCase()} in exchange
        for…
      </Header3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleNext)}
          className={cn(className, "flex flex-col justify-center items-center")}
        >
          <RadioGroup defaultValue="question">
            {choices.slice(offset + 1, offset + 3).map((choice) => (
              <Choice key={choice.id} value={choice.title} />
            ))}

            <Choice key="never" value="I would never." />
          </RadioGroup>
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
            <Button variant="large" type="button" onClick={handleNext}>
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
