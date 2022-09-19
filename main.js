"use strict";

// welcome
const welcome = document.querySelector('.welcome-container');
welcome.addEventListener('click',()=>{
    const antion = document.querySelector('.after');
    antion.style.animation = "welcome 1.2s ease-out forwards";
    welcome.style.animation = "outside-welcome 0.4s 1.15s ease forwards";
    setTimeout(()=>{
        document.body.removeChild(welcome);
    },1650);    
})
// data-base 
const IDBrequest = indexedDB.open('todo-list',1);
IDBrequest.addEventListener('upgradeneeded',()=>{
    const db = IDBrequest.result;
    db.createObjectStore("list-compras",{
        autoIncrement: true
    });
    db.createObjectStore("list-hogar",{
        autoIncrement: true
    });
    db.createObjectStore("list-tareas",{
        autoIncrement: true
    });
    db.createObjectStore("list-otros",{
        autoIncrement: true
    });
    localStorage.setItem("index-compras","1");
    localStorage.setItem("index-hogar","1");
    localStorage.setItem("index-tareas","1");
    localStorage.setItem("index-otros","1");
})
const getTransaction = (base,mode) =>{
    const store = document.querySelector('.container_list').id;
    const db = IDBrequest.result;
    const IDBtransaction = db.transaction(base,mode);
    const objectStore = IDBtransaction.objectStore(store);
    return objectStore;
}
const addObj = (base,obj) =>{
    const db = IDBrequest.result;
    let IDBtransaction = db.transaction(base,"readwrite");
    let objectStore = IDBtransaction.objectStore(base);
    objectStore.add(obj);
}
const updateObj = (base,key,obj)=>{
    const IDBdata = getTransaction(base,"readwrite");
    IDBdata.put(obj,key);
}
const clearObj = (base,key) =>{
    const IDBdata = getTransaction(base,'readwrite');
    IDBdata.delete(key);
}
const readItems = (base) =>{
    const itemsContainer = document.querySelector('.container_list_items-container');
    const store = document.querySelector('.container_list').id;
    const db = IDBrequest.result;
    let IDBtransaction = db.transaction(base,"readwrite");
    let objectStore = IDBtransaction.objectStore(store);
    let cursor = objectStore.openCursor();
    loading('list');
    cursor.addEventListener("success",()=>{
        cursor.result
            ? ( newItem(
                    false,
                    cursor.result.value.verify,
                    cursor.result.value.title,
                    cursor.result.value.date,
                    cursor.result.value.key
              ),cursor.result.continue())
            : ( stopLoad('list'),
                draggeable(itemsContainer,"compras"),
                updateStatus());
    })
    if (itemsContainer.childElementCount == 0) msg('No hay nada agregado');
    cursor.addEventListener('error',()=>{
        stopLoad();
        msg('error');
    })
}
const clear = ()=>{
    const store = document.querySelector('.container_list').id;
    const db = IDBrequest.result;
    let IDBtransaction = db.transaction(store,"readwrite");
    let objectStore = IDBtransaction.objectStore(store);
    let cursor = objectStore.openCursor();
    const items = document.querySelector('.container_list_items-container');
    const index = document.querySelector('.container_list_index');
    cursor.addEventListener("success",()=>{
        cursor.result
            ? ( clearObj(store,parseFloat(cursor.result.value.key)),
                cursor.result.continue())
            : ( items.innerHTML = '',
                index.innerHTML = '',
                msg('Ahora tu lista esta vacia'));
    })
}
const msg = Msg =>{
    const container = document.querySelector('.container_list_items-container');
    const containerMsg = document.createElement('DIV');
    containerMsg.classList.add('container-msg');
    const msg = document.createElement('h3');
    msg.classList.add('container_msg');
    msg.textContent = Msg;
    containerMsg.appendChild(msg);
    container.appendChild(containerMsg);
}
const loading = lC =>{
    const container = document.createElement('DIV');
    container.classList.add('container-loader');
    const load = document.createElement('SPAN');
    load.classList.add('loader');
    container.appendChild(load);
    document.querySelector(`.container_${lC}`).appendChild(container);
}
const stopLoad = lC =>{
    const container = document.querySelector(`.container_${lC}`);
    const containerLoad = document.querySelector('.container-loader');
    container.removeChild(containerLoad);
    container.style.overflow = "visible";
}

// nav 
const bars = document.getElementById('bars');
bars.addEventListener('click',()=>{
    const config = document.querySelector('.nav_config');
    config.style.transform = "translateX(0)";
})
const closeConfig = document.querySelector('.nav_config_close')
closeConfig.addEventListener('click',()=>{
    const config = document.querySelector('.nav_config');
    config.style.transform = "translateX(110%)";
})
const newTheme = document.querySelectorAll('.change-theme');
newTheme.forEach(option =>{
    option.addEventListener('click',()=>{
        localStorage.setItem('theme',option.id);
        const theme = document.createElement('LINK');
        theme.setAttribute('rel','stylesheet');
        theme.setAttribute('href',`styles/themes/${option.id}.css`);
        theme.setAttribute('id','theme');
        const config = document.querySelector('.nav_config');
        config.style.transform = "translateX(110%)";
        document.head.appendChild(theme);
        const temaAntiguo = document.getElementById('theme');
        document.head.removeChild(temaAntiguo);
    })
})
// categories
loading('categories');
const draggeable = (list,storage)=>{
    Sortable.create(list,{
        animation: 150,
        chosenClass: 'selection',
        dragClass: 'drag',
        group: storage,
        store: {
            set: sortable=>{
                updateStatus();
                const index = document.getElementById('no-verify');
                const array = sortable.toArray();
                localStorage.setItem(sortable.options.group.name,array.join('|'));
            },
            get: sortable=>{
                const array = localStorage.getItem(sortable.options.group.name);
                return array ? array.split('|') : [];
            }
        }
    });
}
const list = document.querySelector('.container_categories');
draggeable(list,"categories");
stopLoad('categories');
const categories = document.querySelectorAll('.category');
categories.forEach(category =>{
    category.addEventListener('click',()=>{
        openCategory(category.id)
    })
});
stopLoad('categories');
const openCategory = name =>{
    const panelcategories = document.querySelector('.container');
    document.body.removeChild(panelcategories);
    const container = document.createElement('SECTION');
    container.classList.add('container');
    const outside = document.createElement('SPAN');
    outside.classList.add('outside');
    const containerTitle = document.createElement('DIV');
    containerTitle.classList.add('container_title');
    const title = document.createElement('H4');
    title.textContent = name.split('-')[1];
    const list = document.createElement('DIV');
    list.classList.add('container_list');
    list.setAttribute('id',name);
    const indexContainer = document.createElement('DIV');
    indexContainer.classList.add('container_list_index');
    const itemsContainer = document.createElement('DIV');
    itemsContainer.classList.add('container_list_items-container');
    const toolsContainer = document.createElement('DIV');
    toolsContainer.classList.add('container-tools');
    const addItemContainer = document.createElement('DIV');
    addItemContainer.classList.add('container-tools_add-item-list');
    const addItem = document.createElement('BUTTON');
    addItem.classList.add('btn-add');
    addItem.textContent = "+";
    const clearListContainer = document.createElement('DIV');
    clearListContainer.classList.add('container-tools_clear-list');
    const clearList = document.createElement('SPAN');
    clearList.classList.add('btn-clear-list');
    // append-child
    container.appendChild(outside);
    container.appendChild(containerTitle);
    containerTitle.appendChild(title);
    container.appendChild(list);
    list.appendChild(indexContainer);
    list.appendChild(itemsContainer);
    container.appendChild(toolsContainer);
    toolsContainer.appendChild(addItemContainer);
    toolsContainer.appendChild(clearListContainer);
    addItemContainer.appendChild(addItem);
    clearListContainer.appendChild(clearList);
    document.body.appendChild(container);
    readItems(name);
    // events
    outside.addEventListener('click',()=>{
        document.body.removeChild(container);
        openPanel();
    })
    addItem.addEventListener('click',()=>{
        openModalAddItem("Añadir a la lista:","","CREAR");
    })
    clearListContainer.addEventListener('click',()=>{
        clear();
    })
}
const openPanel = ()=>{
    const container = document.createElement('SECTION');
    container.classList.add('container');
    const containerTitle = document.createElement('DIV');
    containerTitle.classList.add('container_title');
    const title = document.createElement('H4');
    title.textContent = "CATEGORIAS";
    const panel = document.createElement('DIV');
    panel.classList.add('container_categories');
    addCategory(panel,"Compras","compras",1);
    addCategory(panel,"Hogar","hogar",2);
    addCategory(panel,"Tareas","tareas",3);
    addCategory(panel,"Otros","otros",4);
    // append-child
    containerTitle.appendChild(title);
    container.appendChild(containerTitle);
    container.appendChild(panel);
    document.body.appendChild(container);
    // eventes
    const categories = document.querySelectorAll('.category');
    categories.forEach(category =>{
        category.addEventListener('click',()=>{
            openCategory(category.id);
        })
    });
    // SortableJS
    draggeable(panel,"categories");
};
const addCategory = (container,name,db,id)=>{
    const category = document.createElement('DIV');
    category.classList.add('category');
    category.setAttribute('id',`list-${db}`);
    category.setAttribute('data-id',`${id}`);
    const titleContainer = document.createElement('DIV');
    titleContainer.classList.add('category_title');
    const title = document.createElement('H3');
    title.textContent = name;
    // append-child
    titleContainer.appendChild(title);
    category.appendChild(titleContainer);
    container.appendChild(category);
}
// list
const openModalAddItem = (titleModal,titleInput,titleBtn,item,obj) =>{
    const container = document.querySelector('.container_list');
    const background = document.createElement('DIV');
    background.classList.add('background-modal');
    const modal = document.createElement('DIV');
    modal.classList.add('modal');
    const closeModal = document.createElement('DIV');
    closeModal.classList.add('close-modal');
    const spanCloseModal = document.createElement('SPAN');
    const title = document.createElement('H4');
    title.classList.add('modal_title');
    title.textContent = titleModal;
    const createItem = document.createElement('DIV');
    createItem.classList.add('modal_create-item');
    const inputTitle = document.createElement('INPUT');
    inputTitle.setAttribute('id','input-title');
    inputTitle.setAttribute('required','');
    inputTitle.setAttribute('autocomplete','off');
    inputTitle.setAttribute('value',titleInput);
    const label = document.createElement('LABEL');
    label.setAttribute('for','input-title');
    label.classList.add('label-input');
    const spanLabel = document.createElement('SPAN');
    spanLabel.textContent = "Titulo";
    const create = document.createElement('DIV');
    create.classList.add('modal_create');
    const btnCreate = document.createElement('BUTTON');
    btnCreate.classList.add('modal_create_btn');
    btnCreate.textContent = titleBtn;
    // append-child
    background.appendChild(modal);
    modal.appendChild(closeModal);
    modal.appendChild(title);
    modal.appendChild(createItem);
    modal.appendChild(create);
    closeModal.appendChild(spanCloseModal)
    createItem.appendChild(inputTitle);
    createItem.appendChild(label);
    label.appendChild(spanLabel);
    create.appendChild(btnCreate);
    container.appendChild(background);
    // events
    closeModal.addEventListener('click',()=>{
        container.removeChild(background);
    })
    btnCreate.addEventListener('click',()=>{
        if (inputTitle.value.trim().length > 0){
            const db = document.querySelector('.container_list').id.split('-')[1];
            let key = localStorage.getItem(`index-${db}`);
            if (btnCreate.textContent == "CREAR"){
                container.removeChild(background),
                newItem(true,"no-verify",inputTitle.value,null,key),
                localStorage.setItem(`index-${db}`,parseFloat(key)+1,
                )
            } else {
                container.removeChild(background);
                item.textContent = inputTitle.value;
                obj.item.title = inputTitle.value;
                updateObj(obj.db,obj.key,obj.item)
            }
        }
    })
}
const updateStatus = ()=>{
    const items = document.querySelectorAll('.container_list_item');
    let c = 1;
    items.forEach(item =>{
        item.setAttribute('id',`i-${c}`);
        c++;
    });
}
const newItem = (save,check,title,itemDate,key) =>{
    const container = document.querySelector('.container_list_items-container');
    const indexContainer = document.querySelector('.container_list_index');
    if (indexContainer.childElementCount == 0){
        const msg = document.querySelector('.container-msg');
        container.removeChild(msg);
    }
    const item = document.createElement('DIV');
    item.classList.add('container_list_item');
    item.classList.add(`${check}`);
    item.setAttribute('data-id',key);
    item.setAttribute('id',`i-${container.childElementCount+1}`);
    const titleItem = document.createElement('H3');
    titleItem.classList.add('container_list_item_title');
    titleItem.textContent = title.trim();
    const dateItem = document.createElement('P');
    dateItem.classList.add('container_list_item_date');
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    dateItem.innerText = itemDate==null
    ? `${day}/${month}/${year}`
    : itemDate;
    const tools = document.createElement('DIV');
    tools.classList.add('container_list_item_tools');
    const edit = document.createElement('DIV');
    edit.setAttribute('id','tool-edit');
    edit.classList.add('tool');
    const iconEdit = document.createElement('SPAN');
    const clear = document.createElement('DIV');
    clear.setAttribute('id','tool-clear');
    clear.classList.add('tool');
    const iconClear = document.createElement('SPAN');
    const verify = document.createElement('DIV');
    verify.setAttribute('id','tool-checkout');
    verify.classList.add('tool');
    const iconVerify = document.createElement('SPAN');
    const index = document.createElement('SPAN');
    index.setAttribute('id',check);
    index.classList.add('index');
    index.classList.add(`i-${container.childElementCount+1}`);
    index.innerText = container.childElementCount+1;
    // append-child
    item.appendChild(titleItem);
    item.appendChild(dateItem);
    item.appendChild(tools);
    tools.appendChild(edit);
    tools.appendChild(clear);
    tools.appendChild(verify);
    edit.appendChild(iconEdit);
    clear.appendChild(iconClear);
    verify.appendChild(iconVerify);
    container.appendChild(item);
    indexContainer.appendChild(index);
    // events
    const db = document.querySelector('.container_list').id;
    if (save){
        addObj(db,{
            title,
            date: dateItem.textContent,
            key,
            verify: index.id
        });
    }
    clear.addEventListener('click',()=>{
        clearObj(db,parseFloat(key));
        container.removeChild(item);
        indexContainer.removeChild(index);
        const indexes = document.querySelectorAll('.index');
        let c = 1;
        indexes.forEach(newIndex =>{
            newIndex.textContent = c;
            newIndex.classList.add(`i-${c}`);
            c++;
        });
        const items = document.querySelector('.container_list_items-container');
        if (items.childElementCount == 0) msg('Ahora tu lista esta vacia');
    })
    verify.addEventListener('click',()=>{
        const newIndex = document.querySelector(`.${item.id}`);
        console.log(newIndex);
        newIndex.id == "no-verify"
            ? (newIndex.setAttribute('id','verify'),
            item.classList.add('verify'))
            : (newIndex.setAttribute('id','no-verify'),
            item.classList.add('no-verify'));
        updateObj(db,parseFloat(key),{
            title,
            date: dateItem.textContent,
            key,
            verify: newIndex.id
        })
    })
    edit.addEventListener('click',()=>{
        const update = {
            db,
            key: parseFloat(key),
            item: {
                title,
                date: dateItem.textContent,
                key,
                verify: index.id
            }
        }
        openModalAddItem('Editar', title.trim(), "ACTUALIZAR", titleItem,update);        
    })
}
// privacy
const btnPrv = document.querySelector('.nav_config_privacy_title');
btnPrv.addEventListener('click',()=>{
    const container = document.querySelector('.nav_config');
    const privacy = document.createElement('DIV');
    privacy.classList.add('privacy-container');
    const outside = document.createElement('DIV');
    outside.classList.add('outside-privacy');
    const title = document.createElement('H2');
    title.classList.add('privacy_title');
    title.textContent = "Privacidad";
    const p = document.createElement('P');
    p.textContent = `
        Ninguno de los datos que usted ingresa en esta aplicación web son compartidos con cualquier
        otra entidad. Los datos son guardados únicamente en la memoria de su navegador y los puede
        borrar cuando quiera entrando en una lista y presionando el boton de la derecha, limpiar.
    `;
    // append-child
    privacy.appendChild(outside);
    privacy.appendChild(title);
    privacy.appendChild(p);
    container.appendChild(privacy);
    // events
    outside.addEventListener('click',()=>{
        container.removeChild(privacy);        
    })
})