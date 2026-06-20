let BaseURL = 'https://fakestoreapi.com';   
let productUrl = `${BaseURL}/products`;

const productContainer= document.getElementById('productContainer');
const productForm= document.getElementById('productForm');
const titleControl= document.getElementById('title');
const priceControl= document.getElementById('price');
const imgControl= document.getElementById('img');
const addProduct= document.getElementById('addProduct');
const updateProduct= document.getElementById('updateProduct');
const addBtn2= document.getElementById('addBtn2');
const closebackdrop=[...document.querySelectorAll('.closebackdrop')];
const productModel= document.getElementById('productModel')
const spinner= document.getElementById('spinner')


let productArr = []; 
function snackbar(msg,icon){ 
        swal.fire({ 
              title:msg, 
              icon:icon,
              timer:3000
        })
}

function tooltip(){
    $(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
}

function createCard(arr){ 
       let res =" "; 

       arr.forEach(ele=>{ 
                res +=`<div class="col-md-4 mb-4" id=${ele.id}>
                <div class="card productCard">
                    <div class="card-header" data-toggle="tooltip" data-placement="top" title="${ele.title}">
                        <h3>${ele.title}</h3>
                        <h4>${ele.price}$</h4>
                    </div>

                    <div class="card-body">
                           <img src="${ele.image}" alt="">
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <button  onclick="onEdit(this)" class="btn btn-inline-block btn-outline-info" >Edit</button>
                        <button  onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>
                    </div>
                </div>
            </div>`
       });
       productContainer.innerHTML= res ;
       tooltip()
}

function fetchProduct(){ 

spinner.classList.remove('d-none')
    let xhr= new XMLHttpRequest() ;
        xhr.open('GET', productUrl);
 
       xhr.send(null);
       xhr.onload = function(){ 
          if(xhr.status>=200 && xhr.status<=299){ 
                productArr= JSON.parse(xhr.response);
                    createCard(productArr);
                   // snackbar('product fetched successfully', 'success')
                }else{ 
                snackbar('product fetched failed', 'error')
                }
                spinner.classList.add('d-none')
            }

}
fetchProduct();

function onSubmit(eve){ 
          eve.preventDefault();
          spinner.classList.remove('d-none')
    let newProduct = { 
            title:titleControl.value ,
            price:priceControl.value , 
            image:imgControl.value 
    }

    productArr.push(newProduct);

    let xhr= new XMLHttpRequest() ; 
      xhr.open('POST', productUrl); 

      xhr.send(JSON.stringify(productUrl));
      xhr.onload = function(){ 
        if(xhr.status>=200 && xhr.status<=299){ 
            let res = JSON.parse(xhr.response);         
             
            let div= document.createElement('div');
                 div.id= res.id;
                 div.className='col-md-4'; 
                 div.innerHTML= `  <div class="card productCard">
                                    <div class="card-header" data-toggle="tooltip" data-placement="top" title="${newProduct.title}">
                                        <h3>${newProduct.title}</h3>
                                        <h4>${newProduct.price}$</h4>
                                    </div>

                                    <div class="card-body">
                                        <img src="${newProduct.image}" alt="">
                                    </div>
                                    <div class="card-footer d-flex justify-content-between align-items-center">
                                        <button  onclick="onEdit(this)" class="btn btn-inline-block btn-outline-info" >Edit</button>
                                        <button  onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>
                                    </div>
                                </div>`

            productContainer.prepend(div) ;
            tooltip()
         
          }else{ 
              snackbar('product submit failed....!','error')
          }
          spinner.classList.add('d-none')
      } 

}


function onRemove(ele){
     let removeId= ele.closest('.col-md-4').id;
     let removeUrl = `${BaseURL}/products/${removeId}`;

    Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
            }).then((result) => {
            if (result.isConfirmed) { 
                spinner.classList.remove('d-none')

                
                   let xhr =new XMLHttpRequest() ;
                       xhr.open('DELETE', removeUrl);
                       xhr.send(null);
                
                       xhr.onload = function (){ 
                            if(xhr.status>=200 && xhr.status<=299){ 
                                   ele.closest('.col-md-4').remove();
                            }else{ 
                                 snackbar('Failed to delete', 'error')
                            }
                                spinner.classList.add('d-none')

                       }

                 }    
         });
}

function onEdit(ele){
     spinner.classList.remove('d-none')

       let editId= ele.closest('.col-md-4').id;
            localStorage.setItem('EditId', editId);
       let EditUrl= `${BaseURL}/products/${editId}`; 

       document.querySelectorAll('.btn-outline-danger').forEach(btn=>{ 
                  btn.disabled =true;
       })
       let xhr= new XMLHttpRequest(); 
          xhr.open("GET", EditUrl);
          xhr.setRequestHeader('content-type', 'application/json');  
          xhr.setRequestHeader('Autho', 'Get token from');  
           
          xhr.send(null);
          xhr.onload =function(){ 
            if(xhr.status>=200 && xhr.status<=299 ){

                let editObj=JSON.parse(xhr.response);
                
                titleControl.value= editObj.title;
                priceControl.value= editObj.price;
                imgControl.value= editObj.image;
                
                addProduct.classList.add('d-none');
                updateProduct.classList.remove('d-none');
                ontoggleHandler()
                
            }else{ 
                  snackbar('failed to edit','error');
              }
                spinner.classList.add('d-none')

               
          }
        
 }

function onUpdate(){ 
        spinner.classList.remove('d-none')

      let updateId= localStorage.getItem('EditId');

      let updateUrl =`${BaseURL}/products/${updateId}`;

      let updateObj ={ 
            title:titleControl.value , 
            price:priceControl.value , 
            image:imgControl.value , 
             
         }


        let xhr = new XMLHttpRequest() ;
            xhr.open('PATCH', updateUrl);
            xhr.send(JSON.stringify(updateObj))
            
            xhr.onload= function(){ 
            if(xhr.status>=200 && xhr.status<=299 ){ 
                  let col= document.getElementById(updateId);
                   col.innerHTML = `<div class="card productCard">
                                    <div class="card-header" data-toggle="tooltip" data-placement="top" title="${updateObj.title}">>
                                        <h3>${updateObj.title}</h3>
                                        <h4>${updateObj.price}$</h4>
                                    </div>

                                    <div class="card-body">
                                        <img src="${updateObj.image}" alt="">
                                    </div>
                                    <div class="card-footer d-flex justify-content-between align-items-center">
                                        <button  onclick="onEdit(this)" class="btn btn-inline-block btn-outline-info" >Edit</button>
                                        <button  onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>
                                    </div>
                                </div>`
                    addProduct.classList.remove('d-none');
                    updateProduct.classList.add('d-none');
                    productForm.reset();
                    ontoggleHandler()
                    document.querySelectorAll('.btn-outline-danger').forEach(btn=>{ 
                     btn.disabled =false;
                     snackbar('updated successfully', 'success')
                     tooltip()
                     col.classList.add('highlight')
                     setTimeout(() => {
                        col.classList.remove('highlight')
                     }, 4000);
               })
                 
               }else{
                snackbar('Updated failed', 'error')
               }
               spinner.classList.add('d-none')
                  
            } 
            
            
           
        } 



        const backdrop= document.getElementById('backdrop');
function ontoggleHandler(){ 
              backdrop.classList.toggle('active');
              productModel.classList.toggle('active');   
}


addBtn2.addEventListener('click', ontoggleHandler);  



closebackdrop.forEach(btn=>{
       btn.addEventListener('click', ontoggleHandler)
  } 
)



   

 productForm.addEventListener('submit', onSubmit); 
 updateProduct.addEventListener('click', onUpdate)