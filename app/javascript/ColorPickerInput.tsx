import { useState } from "react";
import ColorPicker from "./ColorPicker";

export type ColorPickerInputProps = {
  initialValue: string;
  name: string;
  id: string;
};

function ColorPickerInput({
  name,
  id,
  initialValue,
}: ColorPickerInputProps): JSX.Element {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <ColorPicker value={value} onChange={setValue} />
      <input
        id={id}
        name={name}
        type="hidden"
        value={value}
        className="form-control"
      />
    </>
  );
}

export default ColorPickerInput;
