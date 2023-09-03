import {
  Label,
  RadioGroup,
  RadioGroupItem,
  Input,
  Button,
} from "@/components/base/ui";
import { Choice } from "@/components";
import { getQuestions } from "@/api";
import { cn } from "@/lib/utils";

export const QuestionForm = async ({ className }) => {
  const choices = await getQuestions();

  return (
    <form
      className={cn(className, "flex flex-col justify-center items-center")}
    >
      <RadioGroup defaultValue="question">
        {choices.map((choice) => (
          <Choice key={choice.id} value={choice.title} />
        ))}

        <Choice key="never" value="I would never." />
      </RadioGroup>
      <Button variant="large" type="submit">
        Next
      </Button>
    </form>
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
