import { Label } from "@/components/base/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/base/ui/radio-group";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <RadioGroup defaultValue="option-one">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id="option-one" />
          <Label htmlFor="option-one">a cruise to a tropical destination</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-two" id="option-two" />
          <Label htmlFor="option-two">my dream house</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-three" id="option-three" />
          <Label htmlFor="option-three">an on-call massage therapist</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-four" id="option-four" />
          <Label htmlFor="option-four">
            fill in an exchange of your choosing
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-five" id="option-five" />
          <Label htmlFor="option-five">i would never.</Label>
        </div>
      </RadioGroup>
    </main>
  );
}
