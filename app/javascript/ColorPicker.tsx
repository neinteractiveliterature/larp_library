import { ChromePicker, ColorResult } from "react-color";
import tinycolor2 from "tinycolor2";

function decodeValue(value?: string | null) {
  return tinycolor2(value ?? undefined).toRgb();
}

function encodeValue(value: ColorResult) {
  if (value.rgb.a === 1.0) {
    return tinycolor2(value.rgb).toHexString();
  }

  return tinycolor2(value.rgb).toRgbString();
}

export type ColorPickerProps = {
  value?: string | null;
  onChange: React.Dispatch<string>;
};

function ColorPicker({ value, onChange }: ColorPickerProps): JSX.Element {
  return (
    <ChromePicker
      color={decodeValue(value)}
      onChangeComplete={(newValue) => {
        onChange(encodeValue(newValue));
      }}
    />
  );
}

export default ColorPicker;
