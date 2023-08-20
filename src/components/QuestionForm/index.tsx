import { Label, RadioGroup, RadioGroupItem, Input } from "@/components/base/ui";
import { Choice } from "@/components";
import { getQuestions } from "@/api";

export const QuestionForm = async () => {
  const choices = await getQuestions();

  return (
    <RadioGroup defaultValue="question">
      {choices.map((choice) => (
        <Choice key={choice.id} value={choice.title} />
      ))}

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="custom" id="custom" />
        <Label htmlFor="custom">
          <Input
            type="text"
            placeholder="fill in an exchange of your choosing"
          />
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="never" id="never" />
        <Label htmlFor="never">i would never.</Label>
      </div>
    </RadioGroup>
  );
};

export default QuestionForm;
