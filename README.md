# TP Final Frontend — Aplicación de Mensajería

## Descripción

Este proyecto corresponde al Trabajo Práctico Final de Frontend.

La aplicación consiste en una interfaz de mensajería inspirada en aplicaciones como WhatsApp. Permite iniciar sesión, visualizar conversaciones, buscar chats, enviar mensajes y administrar diferentes elementos de la interfaz.

El objetivo principal del proyecto fue aplicar los conceptos aprendidos durante la cursada de Frontend utilizando React y organizando la aplicación mediante componentes reutilizables, estados, contextos, rutas y custom hooks.

## Tecnologías utilizadas

* React
* JavaScript
* HTML
* CSS
* React Router
* Vite

## Funcionalidades principales

* Inicio de sesión mediante un formulario.
* Visualización de conversaciones.
* Selección de chats.
* Envío de mensajes.
* Búsqueda de conversaciones.
* Manejo de mensajes y estados de lectura.
* Visualización de contactos.
* Creación y manejo de grupos.
* Cambio entre modo claro y modo oscuro.
* Navegación entre diferentes páginas mediante React Router.
* Página para rutas no encontradas.
* Diseño responsive para diferentes tamaños de pantalla.

## Conceptos de Frontend aplicados

Durante el desarrollo se aplicaron los siguientes conceptos trabajados durante la cursada:

### Componentes

La interfaz se encuentra dividida en diferentes componentes para separar las distintas partes de la aplicación y facilitar su reutilización y mantenimiento.

### Estados

Se utilizan estados de React para controlar información que cambia durante el uso de la aplicación, como los mensajes, conversaciones, contactos, búsqueda y diferentes elementos de la interfaz.

### Context API

Se utiliza un contexto para compartir información relacionada con el usuario y la sesión entre diferentes componentes sin necesidad de pasar los datos manualmente mediante props.

### React Router

Se utiliza React Router para manejar la navegación entre las diferentes páginas de la aplicación.

También se utilizan parámetros de búsqueda mediante `useSearchParams` para realizar la búsqueda de conversaciones.

### Formularios

La aplicación cuenta con formularios para el inicio de sesión y para el envío de mensajes.

### Custom Hooks

Se desarrolló un custom hook para separar la lógica relacionada con los mensajes de la parte visual de los componentes.

Esto permite mantener los componentes más organizados y reutilizar la lógica cuando es necesario.

### Diseño responsive

La aplicación fue desarrollada teniendo en cuenta diferentes tamaños de pantalla, incluyendo dispositivos móviles, tablets y computadoras.

También se incorporaron diferentes estilos para adaptar la interfaz según el tamaño disponible.

## Estructura del proyecto

El proyecto se organiza separando páginas, componentes, contextos, hooks, estilos y otras funcionalidades de la aplicación.

Esta estructura permite mantener el código más ordenado y facilita realizar modificaciones en una parte específica sin afectar innecesariamente al resto del proyecto.

## Dificultades durante el desarrollo

Una de las principales dificultades fue organizar correctamente la lógica de la aplicación y separar las responsabilidades entre los diferentes componentes.

También fue necesario trabajar con estados y contexto para lograr que los cambios realizados en una parte de la aplicación se reflejaran correctamente en otras partes.

Otra dificultad fue implementar la navegación y la búsqueda utilizando React Router, además de adaptar la interfaz para diferentes tamaños de pantalla.

Durante el desarrollo también se realizaron correcciones y pruebas para solucionar errores de lógica, estilos y organización del código.

## Objetivo del proyecto

El objetivo principal fue integrar los conocimientos aprendidos durante la cursada en una aplicación funcional desarrollada con React, aplicando componentes, estados, contexto, formularios, React Router, custom hooks y diseño responsive.

## Despliegue

La aplicación se encuentra desplegada y disponible para ser utilizada desde el siguiente enlace:

https://trabajo-integrador-final-utn.vercel.app/

## Repositorio

El código fuente del proyecto se encuentra disponible en GitHub:

https://github.com/matheodev22/Trabajo-integrador-final-utn
