let total = 0;
let carrito = [];
const divMain = document.getElementById ('container');
const divCarrito = document.getElementById('carrito');
const divTotalCarrito = document.getElementById('totalCarrito');
const carritoGeneral = document.getElementById('carritoGeneral');

class Cliente {
  constructor(nombre, direccion, mail) {
    this.nombre = nombre;
    this.direccion = direccion;
    this.mail = mail;
  }
}

//TARJETA DE PRODUCTOS EN EL HTML

const imprimirProductos = async() => {
  const datos  = await fetch('js/inventario.json');
  const inventario = await datos.json();

  inventario.forEach ((elem) => {
    const divProductos = document.createElement('div');
    divProductos.classList.add("card", "col-sm-6", "col-lg-4", "text-bg-white", "border-light");
    divProductos.innerHTML = `
      <img src="${elem.imagen}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${elem.nombre}</h5>
        <p class="card-text">$${elem.precio}.-</p>
        <button href="#" class="btn btn-primary" id="agregar${elem.id}">Agregar al carrito</button>
      </div>`
    divMain.appendChild(divProductos);
  
    const boton = document.getElementById(`agregar${elem.id}`);
    boton.addEventListener("click", () => {
      buscarProducto(elem.id);
    });
  });
};

imprimirProductos();

//FUNCION CHEKEO PRODUCTOS EN LOCALSTORAGE

function productosEnStorage () {
  const itemsEnStorage = localStorage.getItem("NuevoItem");
  console.log(itemsEnStorage);

  if (itemsEnStorage != null){
    carrito = JSON.parse (itemsEnStorage);
    mostrarCarrito();
  };
  
};

// FUNCION DE BUSQUEDA DE PRODUCTOS REPETIDOS EN ARRAY CARRITO

const buscarProducto = async (idProd) => {
  const datos  = await fetch('js/inventario.json');
  const inventario = await datos.json();
  const objetoClickeado = inventario.find((elem) => elem.id === idProd);
  const buscarEnCarrito = carrito.find ((e) => {return e.id === objetoClickeado.id});

  if (buscarEnCarrito === undefined){
    carrito.push(objetoClickeado);
    mostrarCarrito();
  } else {
    buscarEnCarrito.cantidad +=1
    mostrarCarrito();
  };
};

// FUNCION CREAR CARRITO

const mostrarCarrito = () => {
  divCarrito.innerHTML = "";
  carrito.forEach((elem) => {

    const objetoenJSON = JSON.stringify (carrito);
    localStorage.setItem ("NuevoItem", objetoenJSON);

    total = carrito.reduce((accum,e) => {return accum += e.cantidad*e.precio}, 0);

    const divProductosCarrito = document.createElement('div')
    divProductosCarrito.innerHTML = `
    <p><u>${elem.nombre} </u></p>
    <p>- Precio: $${elem.precio} -</p>
    <p>Cantidad:<button class="btn btn-black" onClick="restarCantidad(${elem.id})">➖</button> ${elem.cantidad}<button class="btn btn-black" onClick="sumarCantidad(${elem.id})">✖️</button>  <hr> -</p>
    <p class="subtotal"><b>Subtotal: ${elem.precio * elem.cantidad}</b></p>
    <button class="btn btn-black" onClick="borrarProducto(${elem.id})">❌</button>  <hr>`
    ;

    divCarrito.appendChild(divProductosCarrito);
  })

  divTotalCarrito.innerHTML = `
  <p><b> TOTAL: ${total} <b/></p>
  <button class="btn btn-primary" onClick="alertaBorrarCarrito()">Borrar Carrito</button>
  <button class="btn btn-success" onClick="confirmarCompra()">Confirmar Compra</button>`;

};

// FUNCION DE SUMA DE CANTIDADES EN CARRITO

function sumarCantidad (idProd) { 
  const objetoClickeado = carrito.find((elem) => elem.id === idProd);

  objetoClickeado.cantidad +=1
  mostrarCarrito ()

};

// FUNCION DE RESTA DE CANTIDADES EN CARRITO

function restarCantidad (idProd) { 
  const objetoClickeado = carrito.find((elem) => elem.id === idProd);

  if (objetoClickeado.cantidad > 1) {
    objetoClickeado.cantidad -=1

    mostrarCarrito ()
  } else if (objetoClickeado.cantidad === 1) {
    borrarProducto(idProd)
  }

};

//llAMADO A FUNCION DE CHEKEO EN LOCALSTORAGE

productosEnStorage()

// SWEETALERT PREGUNTA BORRAR CARRITO

function alertaBorrarCarrito(){
  Swal.fire({
    title: '¿Estas seguro que quieres borrar el carrito?',
    text: "",
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '¡Borrar!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        '¡Carrito borrado!',
         borrarCarrito ()
      )
    }
  })
};

// FUNCION BORRAR CARRITO ENTERO      

function borrarCarrito () {
  localStorage.clear();  
  carritoGeneral.innerHTML= "";
  carrito.splice(0,carrito.length);
  total = 0;
  location.reload()
};

//FUNCION BORRAR ELEMENTO DEL CARRITO

const borrarProducto = (idProd) => {
  if (carrito.length === 1) {
    borrarCarrito()
    location.reload()
  } else {
    const elementoAEliminar = carrito.find((e) => e.id === idProd);
    carrito = carrito.filter ((elem) => { return elem !== elementoAEliminar})
    console.log(carrito);
  }
  mostrarCarrito();
};

// CONFIRMAR COMPRA 

function confirmarCompra () {
  divTotalCarrito.innerHTML = "";
  const div = document.createElement('div')
  div.innerHTML = `
  <form action="" method="GET" enctype="multipart/form-data">
        <label for="nombre">Nombre:</label>        
        <input type="text" placeholder="Nombre" id="nombre">
            <br>
        <label for="adress">Dirección:</label>        
        <input type="text" placeholder="adress" id="adress">
            <br>
        <label for="mail">Correo Electrónico:</label>        
        <input type="text" placeholder="mail" id="mail">
            <br>
        
  </form>
  <button id="submit">Enviar</button> <br>
  <p><b> TOTAL: ${total} <b/></p>
  `;
  divTotalCarrito.appendChild (div)

  let submit = document.getElementById('submit')
  submit.addEventListener('click', () => {
    mensajeFinal()
  })

}

//ALERTA FINAL DE CIERRE

mensajeFinal = (cliente) => {
  let nombre = document.getElementById('nombre').value;
  let direccion = document.getElementById('adress').value;
  let mail = document.getElementById('mail').value;
  let cliente1 = new Cliente (nombre, direccion, mail)
  console.log(cliente1)

  Swal.fire({
    title: `MUCHAS GRACIAS ${cliente1.nombre} POR SU COMPRA ❤️. Pronto recibira un correo en ${cliente1.mail} con los detalles del envio a: ${cliente1.direccion}`,
    icon: 'success',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Continuar'
  }).then((result) => {
      Swal.fire(
        borrarCarrito(),
        location.reload()
      )
    }
  );
}



