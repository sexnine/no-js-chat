import type { FC } from "hono/jsx";

const MemberListRemoveUpdate: FC<{ id: string }> = ({ id }) => (
  <style>{`.member-list-item-${id} { display: none; }`}</style>
);

export default MemberListRemoveUpdate;
