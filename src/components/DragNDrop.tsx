import { FC, useState, useRef } from "react";

type DataModel = {
  title: string;
  items: string[];
};
type DragParams = {
  groupId: number;
  itemId: number;
};
type DnDProp = {
  data: DataModel[];
};

const DragNDrop: FC<DnDProp> = ({ data }) => {
  const [list, setList] = useState(data);
  const [dragging, setDragging] = useState(false);
  const dragItem = useRef<DragParams | null>();

  const handleDragStart = (e: any, params: any) => {
    dragItem.current = params;
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnd = (e: any, params: any) => {
    dragItem.current = null;
    setDragging(false);
  };

  const handleDragEnter = (e: any, params: DragParams) => {
    const currentItem = dragItem.current;
    if (
      currentItem?.groupId === params.groupId &&
      currentItem?.itemId === params.itemId
    ) {
      console.log("same");
    } else {
      setList((oldList) => {
        let newList: DataModel[] = JSON.parse(JSON.stringify(oldList));
        newList[params.groupId].items.splice(
          params.itemId,
          0,
          newList[currentItem ? currentItem.groupId : 0].items.splice(
            currentItem ? currentItem.itemId : 0,
            1
          )[0]
        );

        dragItem.current = params;
        return newList;
      });
    }
  };

  const getStyles = (params: any) => {
    const currentItem = dragItem.current;
    if (
      currentItem?.groupId === params.groupId &&
      currentItem?.itemId === params.itemId
    ) {
      return "current dnd-item";
    }
    return "dnd-item";
  };

  return (
    <div className="drag-n-drop">
      {list.map((group, groupId) => (
        <div
          key={groupId}
          className="dnd-group"
          onDragEnter={(e) =>
            dragging && group.items.length === 0
              ? handleDragEnter(e, { groupId, itemId: 0 })
              : null
          }
        >
          <div className="group-title">{group.title}</div>
          {group.items.map((item, itemId) => (
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, { groupId, itemId })}
              onDragEnter={(e) =>
                dragging ? handleDragEnter(e, { groupId, itemId }) : null
              }
              onDragEnd={(e) => handleDragEnd(e, { groupId, itemId })}
              key={itemId}
              className={dragging ? getStyles({ groupId, itemId }) : "dnd-item"}
            >
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export { DragNDrop };
