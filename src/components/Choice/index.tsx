"use client";
import { Label, RadioGroupItem } from "../base/ui";
import { FormControl, FormItem } from "../base/ui/form";

interface IProps extends React.ComponentProps<"div"> {
  label?: string;
  value: string;
}

export const Choice = (props: IProps) => {
  const { label = props.value, value, children } = props;

  return (
    <FormItem className="relative flex items-center w-full rounded-md p-4 font-sans font-extralight uppercase bg-background ">
      <FormControl>
        <>
          <RadioGroupItem value={value} id={value} />
          <Label
            htmlFor={value}
            className="z-50 peer-data-state-checked:text-accent-foreground w-full"
          >
            {children ? children : label}
          </Label>
        </>
      </FormControl>
    </FormItem>
  );
};
