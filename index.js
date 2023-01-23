// Variables
const baseDeDatos = [
    {
        id: 1,
        nombre: 'Tonicos Faciales para limpieza diaria',
        precio: 1000,
        imagen: 'facial/facial-tonico.jpg'
    },
    {
        id: 2,
        nombre: 'Mascarillas de Arcilla ',
        precio: 1200,
        imagen: 'facial/mascarilla-facial-presentacion.jpg'
    },
    {
        id: 3,
        nombre: 'Agua Micelar Desmaquillante',
        precio: 2100,
        imagen: 'facial/agua-micelar.png'
    },
    {
        id: 4,
        nombre: 'Crema Reafirmante para pieles maduras',
        precio: 1300,
        imagen: 'facial/crema-facial-reafirmante.jpg'
    }
];

let carrito = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const DOMbotoncomprar = document.querySelector('#boton-comprar');
const miLocalStorage = window.localStorage;

// Funciones
function renderizarProductos() {
    baseDeDatos.forEach((info) => {
        // Estructura
        const miNodo = document.createElement('div');
        miNodo.classList.add('card', 'col-sm-4');
        // Body
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('card-body');
        // Titulo
        const miNodoTitle = document.createElement('h5');
        miNodoTitle.classList.add('card-title');
        miNodoTitle.textContent = info.nombre;
        // Imagen
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('img-fluid');
        miNodoImagen.setAttribute('src', info.imagen);
        // Precio
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('card-text');
        miNodoPrecio.textContent = `${info.precio}${divisa}`;
        // Boton 
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('btn', 'btn-primary');
        miNodoBoton.textContent = '+';
        miNodoBoton.setAttribute('marcador', info.id);
        miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
        // Insertamos
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
    });
}
function anyadirProductoAlCarrito(evento) {
    
    carrito.push(evento.target.getAttribute('marcador'))
    renderizarCarrito();
   guardarCarritoEnLocalStorage();

    Toastify({
        text: "Producto agregado al carrito",
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast(); 
}
function renderizarCarrito() {
    // Vaciamos todo el html
    DOMcarrito.textContent = '';
    // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
        // Obtenemos el item que necesitamos de la variable base de datos
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            // ¿Coincide las id? Solo puede existir un caso
            return itemBaseDatos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
            return itemId === item ? total += 1 : total;
        }, 0);
        // Creamos el nodo del item del carrito
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
        // Boton de borrar
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    // Renderizamos el precio total en el HTML
    DOMtotal.textContent = calcularTotal();
}

/**
* Evento para borrar un elemento 
*/
function borrarItemCarrito(evento) {
  const id = evento.target.dataset.item;
   carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
   renderizarCarrito();
   guardarCarritoEnLocalStorage();

}

function calcularTotal() {
    // Recorremos el array 
    return carrito.reduce((total, item) => {
        // De cada elemento obtenemos su precio
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        // Los sumamos al total
        return total + miItem[0].precio;
    }, 0).toFixed(2);
}

/**
* Varia el carrito y vuelve a dibujarlo
*/
function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
   renderizarCarrito();
  localStorage.clear();

}

function guardarCarritoEnLocalStorage() {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage() {
   if (miLocalStorage.getItem('carrito') !== null) {
       carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}
// Eventos
DOMbotonVaciar.addEventListener('click', vaciarCarrito);
// Inicio
cargarCarritoDeLocalStorage();
renderizarProductos();
renderizarCarrito();

Swal.fire({
    title: 'BIENVENIDO!',
    text: "Te importa el PLANETA?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Siii!!, soy Ecofriendly!'
}).then((result) => {
    if (result.isConfirmed) {
        Swal.fire(
            ' ya eres Eco! Que bueno!!',
            ' Que tengas una buena compra, a TI te deseamos lo mejor, HERMOSO SER HUMANO .',
            'success'
        )
    }
})

//fetch(url, config)
fetch('https://jsonplaceholder.typicode.com/posts')
.then (response => response.json())
.then( data => console.log (data))
.catch(error => console.log(error));


fetch('https://jsonplaceholder.typicode.com/posts',{
    method: 'post',
    body: JSON.stringify ({
        title: "probando",
        body: "nuestra primera publicacion",
    userId: 1,
    }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },  
})
.then (response => response.json())
.then( data => console.log (data))
.catch(error => console.log(error));

const lista = document.getElementById("lista");
fetch("data.JSON")
.then(response => response.json())
.then( data => {data.foreach (producto)} )
.catch(error => console.log(error));

const traerproductos =async() => {
   const response= await fetch('https://jsonplaceholder.typicode.com/posts');
   const data= await response.JSON();
   console.log(data.results);
}
traerproductos();