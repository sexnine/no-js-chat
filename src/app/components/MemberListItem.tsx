import type { FC } from "hono/jsx";

const MemberListItem: FC<{ id: string; name: string }> = ({ id, name }) => (
  <div slot="member-list" class={`member-list-item-${id}`}>
    {name}
  </div>
);

export default MemberListItem;
