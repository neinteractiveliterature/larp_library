export type TagAttributes = {
  color: string;
  text_color: string;
  icon: string;
  name: string;
  category_name: string;
};

export type TagProps = {
  tag: TagAttributes;
};

function Tag({ tag }: TagProps): JSX.Element {
  return (
    <div
      className="label label-default"
      style={{
        backgroundColor: tag.color,
        color: tag.text_color,
        fontSize: "90%",
      }}
    >
      <i
        className={`fa fa-${tag.icon}`}
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          marginRight: "0.2em",
        }}
        aria-hidden
      ></i>
      {tag.name}
    </div>
  );
}

export default Tag;
