const data=[
    {
      id: 1,
      name: "Banh keo",
      des: "Banh keo chua duong va tinh bot va ca phu pham khac",
      parentId: 0
    },
    {
      id: 2,
      name: "keo",
      des: "keo chu yeu chua duong",
      parentId: 1
    },
    {
      id: 3,
      name: "banh",
      des: "Banh chua tinh bot, duong, trung, sua ..." ,
      parentId: 1
    }, {
      id: 4,
      name: "banh chuoi",
      des: "Banh chuoi duoc lam tu chuoi" ,
      parentId: 3
    }
  ];
  function convertTreeData(ar) {
    let root = [];
    let child = {};
   const objPid=new Map();
   for(let i=0; i<ar.length; i++){
      const item =ar[i];
      const {parentId}=item;
      if(parentId){
          objPid.set(parentId, true)
      }
   }
    ar.forEach((item, index) => {
      const { id, parentId } = item;
      child[id] = child[id] || [];
      const hasChild=objPid.get(id);
      if (hasChild) item.childs = child[id];
      if (parentId !== 0) {
        child[parentId] = child[parentId] || [];
        child[parentId].push(item);
      } else root.push(item);
    });
    return root;
  }
  const treeData=convertTreeData(data);

  const flatData=(node, array=[])=>{
    const {id, childs}=node;
    const newNode=JSON.parse(JSON.stringify(node))
    delete newNode.childs;
    array.push({...newNode})
    if(childs && childs.length>0){
        console.log("child", childs)
        childs.forEach((item)=>{
            flatData(item, array)
        })
    }
    return array;
  };
  console.log("flatData", flatData(treeData[0]))
  function flatten(node, path = [], array = []) {
    const { id, name } = node
    const newPath = [...path, id]
    const children = node.children || []
    array.push({ id, name, path: newPath })
    children.forEach(child => {
      flatten(child, newPath, array)
    })
    return array
  };
  function getNodeById(data, idNode, obj=[]){
    console.log(data);
    if(!idNode) throw Error("id is undefine or null");
    for(let i=0; i<data.length; i++){
        const item=data[i];
        const {id, childs, parentId}=item;
        console.log("id", idNode, id)
        if(id===idNode){
            obj.push(item);
            break;
        }
        else if(childs?.length>0){
          getNodeById(childs, idNode, obj)
        }
    };
    console.log("obj return", obj)
    return obj[0]
  };
  console.log("nodeId", getNodeById(treeData, 3))
  
  console.log(flatten(treeData[0]))