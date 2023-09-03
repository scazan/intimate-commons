import {
  Label,
  RadioGroup,
  RadioGroupItem,
  Input,
  Button,
} from "@/components/base/ui";
import { Choice, Header2, Header3 } from "@/components";
import { getQuestions } from "@/api";
import { cn } from "@/lib/utils";

export const QuestionForm = async ({ className }) => {
  const choices = await getQuestions();
  const step = 0;

  return (
    <>
      <Header2>QUESTION 1 OF 5</Header2>
      <Header3>Would you share your PET in exchange for…</Header3>
      <form
        className={cn(className, "flex flex-col justify-center items-center")}
      >
        <RadioGroup defaultValue="question">
          {choices.map((choice) => (
            <Choice key={choice.id} value={choice.title} />
          ))}

          <Choice key="never" value="I would never." />
        </RadioGroup>
        <div
          className={cn(
            "flex justify-between items-center w-full py-7 px-4",
            step === 0 ? "justify-center" : "justify-between",
          )}
        >
          <Button variant="large" type="submit">
            Next
          </Button>
        </div>
      </form>
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
