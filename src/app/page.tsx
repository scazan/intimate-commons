import { Label, RadioGroup, RadioGroupItem, Input } from "@/components/base/ui";
import { Choice } from "@/components";
import { getQuestions } from "@/api";

export function InputDemo() {
  return;
}

export default async () => {
  const choices = await getQuestions();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <RadioGroup defaultValue="option-one">
        {choices.map((choice) => (
          <Choice key={choice.id} value={choice.title} />
        ))}

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-four" id="option-four" />
          <Label htmlFor="option-four">
            <Input
              type="text"
              placeholder="fill in an exchange of your choosing"
            />
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-five" id="option-five" />
          <Label htmlFor="option-five">i would never.</Label>
        </div>
      </RadioGroup>
    </main>
  );
};
