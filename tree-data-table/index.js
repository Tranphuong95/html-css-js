window.addEventListener("DOMContentLoaded", async () => {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  // let data = [];
  // await fetch("./data.json")
  //   .then((res) => res.json())
  //   .then((res) => (data = res.data));
  const data = await (await fetch("./data.json")).json();
  const treeData = convertTreeData(data.data);
  const tbodyElm = $("tbody");
  handleOpenMoreItem = (e) => {
    console.log("open");
    const id = e.dataset.id;
    const childData = data.data.find((f) => Number(f.id) === Number(id)).childs;
    // const childDataId = data.data.filter(
    //   (f) => Number(f.parentId) === Number(id)
    // );
    // const resultDectectChildElm = [];
    // childDataId.map((_) => {
    //   const childId = _.id;
    //   const elm = $(`tr[data-id="${childId}"]`);
    //   if (elm) resultDectectChildElm.push(elm);
    // });
    // console.log("resultDectectChildElm", resultDectectChildElm, childDataId);
    // if(resultDectectChildElm.length>0){
    //   resultDectectChildElm.forEach(_=>_?.remove());
    //   return;

    // }
    const nodeData = getNodeById(treeData, id);
    const childNodes = flatData(nodeData);
    const resultDectectChildElm = [];
    // childNodes.map((_) => {
    //   const childId = _.id;
    //   const elm = $(`tr[data-id="${childId}"]`);
    //   if (elm) resultDectectChildElm.push(elm);
    // });
    // if(resultDectectChildElm.length>0){
    //   resultDectectChildElm.forEach(_=>_?.remove());
    //   return;
    // }
    for (let i = 0; i < childNodes.length; i++) {
      const item = childNodes[i];
      const elm = $(`tr[data-id="${item.id}"]`);
      if (elm) {
        resultDectectChildElm.push(elm);
        elm.remove();
      }
    }
    if (resultDectectChildElm.length > 0) {
      e.classList.toggle("down");
      return;
    }
    e.classList.toggle("down");
    const tr = e.parentElement.parentElement.parentElement;
    const { ariaLevel: ariaLevelParentElm } = tr;
    const currentLevel = Number(ariaLevelParentElm || 0) + 1;

    const createDivEmty = (length) =>
      Array.from({ length: length })
        .map((_) => `<div class="emty"></div>`)
        .join("");

    const parentElm = tr.parentElement;
    const trChildElm = parentElm.children;
    let currentNodeIndex;
    let nextElmId;
    for (let i = 0; i < trChildElm.length; i++) {
      if (Number(trChildElm[i].dataset.id) === Number(id)) {
        currentNodeIndex = i;
        nextElmId = trChildElm[i + 1]?.dataset?.id;
      }
    }
    childData.forEach((item) => {
      const listElm = $("[data-id]");
      // tbodyElm.appendChild(document.createElement("tr"));
      // const parentElm = tr.parentElement;
      // const trChildElm = parentElm.children;
      const trElm = `<tr aria-level=${currentLevel} data-id=${item.id} oncontextmenu="handleContextMenu(event, this)">
      <td>
        <div class="treelist-icon-container">
        ${createDivEmty(
          item?.childs?.length > 0 ? currentLevel : currentLevel + 1
        )}
          ${
            item?.childs?.length > 0
              ? `<div class="more" data-id=${item.id} onclick="handleOpenMoreItem(this)"></div>`
              : ""
          }
          <div class="tb-content">${item.id}</div>
        </div>
      </td>
      <td>
        <div class="treelist-icon-container">
          <div>${item.name}</div>
        </div>
      </td>
      <td>
        <div class="treelist-icon-container">
          <div>${item.des}</div>
        </div>
      </td>
    </tr>`;
      const nextElmIndex = Array.from(trChildElm).findIndex(
        (f) => Number(f.dataset.id) === Number(nextElmId)
      );
      if (currentNodeIndex >= 0 && nextElmIndex >= 0) {
        tbodyElm.children[nextElmIndex].insertAdjacentHTML("beforebegin", trElm)
      } else {
        tbodyElm.children[tbodyElm.children.length - 1].insertAdjacentHTML("afterend", trElm)
      }
    });
  };

  const trElm = treeData
    .map((elm) => {
      return `<tr aria-level="0" data-id=${
        elm.id
      } oncontextmenu="handleContextMenu(event, this)">
      <td>
        <div class="treelist-icon-container">
          ${
            elm.childs.length > 0 &&
            `<div class="more" data-id=${elm.id} onclick="handleOpenMoreItem(this)"></div>`
          }
          <div class="tb-content">${elm.id}</div>
        </div>
      </td>
      <td>
        <div class="treelist-icon-container">
          <div>${elm.name}</div>
        </div>
      </td>
      <td>
        <div class="treelist-icon-container">
          <div>${elm.des}</div>
        </div>
      </td>
    </tr>`;
    })
    .join("");
  tbodyElm.innerHTML = trElm;

  function convertTreeData(ar = []) {
    let root = [];
    let child = {};
    ar.forEach((item, index) => {
      // const { id, parentId: pId } = item;
      const { id, parentId } = item;
      child[id] = child[id] || [];
      const hasChild = ar.findIndex((f) => f.parentId === id);
      if (hasChild >= 0) item.childs = child[id];
      if (parentId !== 0) {
        child[parentId] = child[parentId] || [];
        child[parentId].push(item);
      } else root.push(item);
    });
    return root;
  }
  //context-menu;
  let idElm;
  handleContextMenu = (event, targetElm) => {
    event.preventDefault();
    const id = targetElm.dataset.id;
    idElm = id;
    const layerX = event.layerX;
    const layerY = event.layerY;
    console.log(
      "contextmenu",
      event,
      event.target,
      event.layerX,
      event.layerY,
    );
    const submenuWrapperWrapper = $(".context-menu-wrapper");
    submenuWrapperWrapper.style.display = "block";
    submenuWrapperWrapper.style.left = layerX + "px";
    submenuWrapperWrapper.style.top = layerY + "px";
  };
  handleDetail = (event, targetElm) => {
    const infor = data.data.find((f) => Number(f.id) === Number(idElm));
    const {id, name:nameInfor, des, parentId}=infor
    // const formElm = document.createElement("div");
    const formdetailWrapper=$(".formdetail-wrapper");
    formdetailWrapper.style.display="flex";
    formdetailWrapper.innerHTML = `<div class="form-container">
    <div class="title">
        <span data-type-form="add">Task detail</span>
        <span onclick="handleClickForm(event,this)"><i class="fa-solid fa-xmark"></i></span>
    </div>
    <!-- <span style="color: red; cursor: pointer">Close</span> -->
    <div class="form-detail">
        <form >
            <div class="group">
              <label>Id</label>
              <input type="number" name="id" oninput="handleChange(this)"/>
            </div>
            <div class="group">
              <label>Name</label>
              <input type="text" name="name" oninput="handleChange(this)"/>
            </div>
            <div class="group">
              <label>Description</label>
              <input type="text" name="des" oninput="handleChange(this)"/>
            </div>
            <div class="group">
              <label>ParentId</label>
              <input type="number" name="parentId" oninput="handleChange(this)"/>
            </div>
            <button class="btn-add-form btn-form" type="button" onclick="handleAddData()">Add</button>
          </form>
    </div>`;
    // fill data to input
    fillDataToForm(id, nameInfor, des, parentId);
  };
  handleClickForm = (event, targetElm) => {
    const formdetailWrapper = $(".formdetail-wrapper");
    formdetailWrapper.style.display = "none";
    formdetailWrapper.removeChild(formdetailWrapper.children[0]);
  };

  function clickRemoveContetMenu(e) {
    const submenuWrapperWrapper = $(".context-menu-wrapper");
    if (
      !submenuWrapperWrapper.contains(e.target) ||
      !tbodyElm.contains(e.target)
    ) {
      submenuWrapperWrapper.style.display = "none";
    }
  };
  function contextMenuEventRemoveContextMenu(e) {
    console.log("remove contextmenu");
    const submenuWrapperWrapper = $(".context-menu-wrapper");
    if (!tbodyElm.contains(e.target)) {
      submenuWrapperWrapper.style.display = "none";
    }
  };
  function fillDataToForm(id, nameInfor, des, parentId){
    const inputId=$("input[name=id]");
    const inputName=$("input[name=name]");
    const inputDes=$("input[name=des]");
    const inputParentId=$("input[name=parentId]");
    inputId.value=id;
    inputName.value=nameInfor;
    inputDes.value=des;
    inputParentId.value=parentId;
  }

  document.addEventListener("click", clickRemoveContetMenu);
  // document.addEventListener("contextmenu", contextMenuEventRemoveContextMenu);
});
function flatData(node, array = []) {
  const { childs } = node;
  if (childs && childs.length > 0) {
    childs.forEach((item) => {
      const newItem = JSON.parse(JSON.stringify(item));
      delete newItem.childs;
      array.push({ ...newItem });
      flatData(item, array);
    });
  }
  return array;
}
function getNodeById(data, idNode, obj = []) {
  if (!idNode) throw Error("id is undefine or null");
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const { id, childs } = item;
    if (Number(id) === Number(idNode)) {
      obj.push(item);
      break;
    } else if (childs?.length > 0) {
      getNodeById(childs, idNode, obj);
    }
  }
  return obj[0];
}
