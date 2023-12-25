import React, { useState } from "react"
import "./Welcome.css"
import Wallpaper from "./Wallpaper.jpg"

export default function Wellcome() {
  return (
    <>
      <div className="welcome-container">
        <header className="header-welcome">
          <div className="tittle-header">
            <img src="/Focus Logo Vector Large.png" alt="Logo" />
            <h2>Focus</h2>
          </div>
          <div>
            <a href="">log in</a>
            <a href="">Register</a>
          </div>
        </header>
        <div className="container">
          <div className="start-div">
          <div className="box">
            <h1>Esto, es <mark>Focus</mark></h1>
          </div>
          </div>
          <br />
          <div className="text-block">
            Focus Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quibusdam repellendus quae ea et, officiis dolores nihil asperiores
            est, sapiente dignissimos laudantium. Quod temporibus deleniti quae
            impedit expedita ex et earum? Lorem ipsum dolor, sit amet
            consectetur adipisicing elit. Reiciendis odit expedita optio?
            Quibusdam, quae explicabo neque nihil architecto eligendi distinctio
            id, dolore nostrum inventore unde! Voluptatibus iure ipsam illo
            dignissimos. Obcaecati dignissimos pariatur, ducimus iure ipsa vero
            optio corrupti numquam vitae reiciendis vel ex temporibus, sapiente
            placeat atque alias quam quod maxime perspiciatis inventore nostrum
            repellendus ut! Culpa, doloremque veniam. Voluptates, laborum?
            Molestiae dicta voluptate quasi laudantium tempora commodi est
            labore quidem? Blanditiis voluptas cupiditate in! Possimus adipisci
            velit omnis temporibus provident illo vero eaque dolorem ratione
            recusandae. Sint, quas? Quasi reiciendis rem tempore tempora nobis,
            ipsum qui dignissimos aliquid iste, fuga dolore, doloribus quam
            quis. Quaerat ipsum molestiae laborum. Earum velit neque pariatur
            libero provident dignissimos porro a eius? Sit tempore facilis qui
            nihil fugit quod ex reprehenderit ea totam nemo. Sit quam, sunt
            soluta mollitia explicabo ullam cumque fugiat, minus perferendis
            corrupti doloremque suscipit perspiciatis ad sapiente voluptatem.
          </div>
          <div className="cards">
            <div className="card">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga nisi laborum, nobis alias assumenda in ullam quis iste veritatis recusandae aliquid delectus cupiditate, quo tenetur pariatur omnis soluta quidem temporibus!</div>
            <div className="card"><img src="https://placebear.com/g/300/300" alt="Test img" /></div>
            <div className="card"><img src="https://placebear.com/g/300/300" alt="Test img" /></div>
            <div className="card">Lorem ipsum dolor sit amet consectetur adipisicing elit. A distinctio placeat quae voluptatibus nobis odit impedit enim neque sint tempore, eligendi hic non molestias perspiciatis aut nesciunt, recusandae et necessitatibus?</div>
          </div>
          <div className="text-box">
            <h1>Empieza a tomar el <mark>Control</mark></h1>
            <button className="subscribe-button">¡Suscríbete ahora!<br />(Es gratis)</button>
          </div>
        </div>
      </div>
      <footer className="footer-welcome">
        <p>FOCUS PROJECT</p>
        <div id="footer-links">
          <a href="">Home</a>
          <a href="">About</a>
          <a href="">Contact Us</a>
        </div>
      </footer>
    </>
  )
}
