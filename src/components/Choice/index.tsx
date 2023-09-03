import { Label, RadioGroupItem } from "../base/ui";

export const Choice = (props: { label?: string; value: string }) => {
  const { label = props.value, value } = props;

  return (
    <div className="relative flex items-center w-full rounded-md p-4 font-sans font-extralight uppercase bg-background ">
      <RadioGroupItem value={value} id={value} />
      <Label
        htmlFor={value}
        className="z-50 peer-data-state-checked:text-accent-foreground"
      >
        {label}
      </Label>
    </div>
  );
};
