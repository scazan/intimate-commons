import { Label, RadioGroupItem } from "../base/ui";

export const Choice = (props: { label?: string; value: string }) => {
  const { label = props.value, value } = props;

  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={value} />
      <Label htmlFor="option-three">{label}</Label>
    </div>
  );
};
