// Storage Controller
const StorageCrtl = (function(){
  // Public
  return{
    storeItemToLS: function(item){
      let items;
      if(localStorage.getItem('items') === null){
        // Set an empty Array
        items = [];
        // Push the newitem called item from the itemAddSubmit into the empty array set.
        items.push(item);
        // Set the array back to recieve object in JSON form.
        items = localStorage.setItem(('items'), JSON.stringify(items));
      }else{
        // Purse the object out of the LS in stringify JSON form, into normal object 
        items = JSON.parse(localStorage.getItem('items'))
        // Push the newitem called item into the occupied array called items
        items.push(item);
         // Set the array back to recieve object in JSON form.
         items = localStorage.setItem(('items'), JSON.stringify(items));
      }
    },
    getItemFromLS: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      }else{
        items = JSON.parse(localStorage.getItem('items'))
      }
      return items;
    },
    updateItemFromLS: function(updateItem){
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item, index){
        if(updateItem.id === item.id){
          items.splice(index, 1, updateItem);
        }
      })
      items = localStorage.setItem(('items'), JSON.stringify(items)); 
    },
    deleteItemFromLS: function(id){
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1);
        }
      })
      items = localStorage.setItem(('items'), JSON.stringify(items)); 
    },
    clearAllItemsFromLS: function(){
      //localStorage.clear('items')
            //OR
      localStorage.removeItem('items')
    }
  }

})()

// Items Controller
const ItemCrtl = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure/ State
  const data = {
    // items: [
    //   // {id: 0, name:'Steak Dinner', calories: 1200},
    //   // {id: 1, name:'Cookies', calories: 400},
    //   // {id: 2, name:'Eggs', calories: 300}
    // ],
    items: StorageCrtl.getItemFromLS(),
    currentItem: null,
    totalCalories: 0
  
  } 
  
  // Public State
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      
      let ID;
      // Create ID
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
       // Calories to number
      calories = parseInt(calories);
        // Create new item
       newItem = new Item(ID, name, calories);
        // Add to items array
       data.items.push(newItem);
       return newItem;
    },

    getTotalClories: function(){
      let total = 0;
      //Loop through data structure tot add calories
      data.items.forEach(function(item){
        total += item.calories;
      })
      // Set totalCalories in the data structure
      data.totalCalories = total;
      return data.totalCalories;
    },
    getItemByid: function(id){
      let found = null;
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      })
      return found; 
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getUpdateItem: function(name, calories){
      // Lets make sure our calories its a number
       calories = parseInt(calories)
      // Set a variable for confirmation
      let found = null;
      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      })
      return found;
    },
    deleteItem: function(id){
      const ids = data.items.map(function(item){
        return item.id;
      });
      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    },
    clearItems: function(){
      data.items = [];
    },
    logData: function(){
      return data;
    }
  }
})()


// UI Controller
const UICrtl = (function(){
   const UISelectors = {
    ClearAllBtn:'.clear-btn',
    listItems: '#item-list li',
    listItem: '#item-list',
    AddBtn: '.add-btn',
    UpdateBtn: '.update-btn',
    DeleteBtn: '.delete-btn',
    BackBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    tCalories:'.total-calories'

  }


  // Public methods
  return{
    getPopulate: function(items){
      let html = ''
      items.forEach(function(item){
         html +=`<li class="collection-item" id="item-${item.id}">
         <strong>${item.name}: </strong><em>${item.calories}</em>
         <a href="#" class="secondary-content">
           <i class=" edit-item fa fa-pencil"></i>
         </a>
       </li>` 
      });

      document.querySelector(UISelectors.listItem).innerHTML = html;
    },


    getItemInput: function(){
      return{
        name:document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function(item){

      document.querySelector(UISelectors.listItem).style.display = 'block';
    
      // Create li Element
      const li = document.createElement('li');
      // Add className
      li.className = 'collection-item';
      // Add id
      li.id = `item-${item.id}`
      // Add innerHTML
      li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories}</em>
      <a href="#" class="secondary-content">
        <i class=" edit-item fa fa-pencil"></i>
      </a>`;
      // insert into the Itemlist
      document.querySelector(UISelectors.listItem).insertAdjacentElement('beforeend', li)
    },
    updateItemList: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Conver lis node to array(becuase we can't loop through node)
       listItems = Array.from(listItems);

       listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML=`<strong>${item.name}: </strong><em>${item.calories}</em>
          <a href="#" class="secondary-content">
            <i class=" edit-item fa fa-pencil"></i>
          </a>`
        }
       })
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    hideListItem: function(){
      document.querySelector(UISelectors.listItem).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.tCalories).textContent = totalCalories;      
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCrtl.getCurrentItem().name
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCrtl.getCurrentItem().calories;
      UICrtl.showEditState();
    },
    deleteItemList: function(id){
      const itemID = `#item-${id}`
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearListItems: function(){
      let Listitems = document.querySelectorAll(UISelectors.listItems);
      Listitems = Array.from(Listitems);
      Listitems.forEach(function(item){
        item.remove();
      })
    },
    clearEditstate: function(){
      document.querySelector(UISelectors.AddBtn).style.display = 'inline'
      document.querySelector(UISelectors.UpdateBtn).style.display = 'none'
      document.querySelector(UISelectors.DeleteBtn).style.display = 'none'
      document.querySelector(UISelectors.BackBtn).style.display = 'none'
      // clearinput
     UICrtl.clearInput();
    },
    showEditState: function(){
      document.querySelector(UISelectors.AddBtn).style.display = 'none'
      document.querySelector(UISelectors.UpdateBtn).style.display = 'inline'
      document.querySelector(UISelectors.DeleteBtn).style.display = 'inline'
      document.querySelector(UISelectors.BackBtn).style.display = 'inline'  
    },

    getSelectors: function(){
      return UISelectors

    },

  }

})()

// App Controller( The Main Controller)
const AppCrtl = (function(ItemCrtl,StorageCrtl, UICrtl){
  // Load Event Listener
  const loadEventListeners = function(){
  // Get UISelectors
    const UISelectors = UICrtl.getSelectors();
     // Item Add Submit
    document.querySelector(UISelectors.AddBtn).addEventListener('click',itemAddSubmit);

    // Disable Enter key
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    // Edit Item Click
    document.querySelector(UISelectors.listItem).addEventListener('click', itemEditClick);
    // Update Item Submit
    document.querySelector(UISelectors.UpdateBtn).addEventListener('click',itemUpdateSubmit);
    // Back to Add item
    document.querySelector(UISelectors.BackBtn).addEventListener('click', function(e){
      UICrtl.clearEditstate();
      e.preventDefault()
    })
    // Delete Item 
    document.querySelector(UISelectors.DeleteBtn).addEventListener('click',deleteItemClick);
    // Clear All Items
    document.querySelector(UISelectors.ClearAllBtn).addEventListener('click',clearAllItems);

  }
  const itemAddSubmit = function(e){
    const input = UICrtl.getItemInput();
    if(input.name !== '' && input.calories !== '' ){
        // Add Item
       const newItem = ItemCrtl.addItem(input.name, input.calories);
       // AddListItem
       UICrtl.addListItem(newItem);
       // Add totalCalories
       const totalCalories = ItemCrtl.getTotalClories();
       // showTotalCalories
       UICrtl.showTotalCalories(totalCalories);
       StorageCrtl.storeItemToLS(newItem);
       // clearinput
       UICrtl.clearInput();
       
    }
    e.preventDefault();
  }
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
      //const Listid = e.target.parentElement.parentElement;
                   // OR
     const Listid = e.target.parentNode.parentNode.id;
     const ListidArr = Listid.split('-')
     const id = parseInt(ListidArr[1])
     // Get Edit Item
     const itemToEdit = ItemCrtl.getItemByid(id);
     // Set cureent item 
     ItemCrtl.setCurrentItem(itemToEdit) ; 

     UICrtl.addItemToForm();
    }
        e.preventDefault()
  }

  // Update Submit Item
  const itemUpdateSubmit = function(e){
    // Get item input
    const input = UICrtl.getItemInput();
    // Set Update Item
    const updateItem = ItemCrtl.getUpdateItem(input.name, input.calories);
    // Update UI
    UICrtl.updateItemList(updateItem);
     // Add totalCalories
     const totalCalories = ItemCrtl.getTotalClories();
     // showTotalCalories
     UICrtl.showTotalCalories(totalCalories);
     // Update itrem in the LS
     StorageCrtl.updateItemFromLS(updateItem);
     // Clear Edit Stat
     UICrtl.clearEditstate();
    e.preventDefault()
  }
  // Delete Item from data structure and listItems
  const deleteItemClick = function(e){
    const currentItem = ItemCrtl.getCurrentItem();
    // Delete Item
    ItemCrtl.deleteItem(currentItem.id);
    // Delete Item List
    UICrtl.deleteItemList(currentItem.id);
    // Add totalCalories
    const totalCalories = ItemCrtl.getTotalClories();
    // showTotalCalories
    UICrtl.showTotalCalories(totalCalories);
    // Delete item from LS
    StorageCrtl.deleteItemFromLS(currentItem.id);
    // Clear Edit Stat
    UICrtl.clearEditstate();
    e.preventDefault();  
  }
  const clearAllItems = function(e){
    // Clear items
    ItemCrtl.clearItems();
    // Clear List items
    UICrtl.clearListItems();
    // Add totalCalories
    const totalCalories = ItemCrtl.getTotalClories();
    // Show TotalCalories
    UICrtl.showTotalCalories(totalCalories);
    //Clear All items From LS
    StorageCrtl.clearAllItemsFromLS();
    // Clear Edit Stat
    UICrtl.clearEditstate();
    // Hide listitem(line)
    UICrtl.hideListItem();
    e.preventDefault()
  }
  // Public methods
  return{
    init: function(){
      // Clear Edit Stat
      UICrtl.clearEditstate();
      const items = ItemCrtl.getItems()
      if(items.length === 0){
        UICrtl.hideListItem();
      }else{
        UICrtl.getPopulate(items);
      }  
      // Add totalCalories
      const totalCalories = ItemCrtl.getTotalClories();
      // showTotalCalories
      UICrtl.showTotalCalories(totalCalories);
      //console.log(ItemCrtl.logData())
      loadEventListeners()
    }
  }
})(ItemCrtl,StorageCrtl, UICrtl)

AppCrtl.init()