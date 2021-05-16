import { TagFragment } from './queries.generated';

export type TagProps = {
  tag: TagFragment;
};

function Tag({ tag }: TagProps): JSX.Element {
  return (
    <div
      className="badge badge-pill"
      style={{
        backgroundColor: tag.tagCategory?.color ?? '#777777',
        color: tag.tagCategory?.textColor ?? '#FFFFFF',
        fontSize: '90%',
      }}
    >
      <i
        className={`fa fa-${tag.tagCategory?.icon ?? 'tag'}`}
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          marginRight: '0.2em',
        }}
        aria-hidden
      ></i>
      {tag.name}
    </div>
  );
}

export default Tag;
