import React, { useState } from "react"
import "./Welcome.css"

export default function Wellcome() {
  return (
    <>
      <div className="welcome-container">
        <header className="header-welcome">
          <div className="tittle-header">
            <div>
              <img src="/Focus Logo Vector Large.png" alt="Logo" />
            </div>
            <div>
              <h2>Focus</h2>
            </div>
          </div>
          <div>
            <a href="">log in</a>
            <a href="">Register</a>
          </div>
        </header>
        <div className="container">
          <div className="box">
            <h1>This, is Focus</h1>
          </div>
          <br />
          <div className="text-block">
            Focus Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quibusdam repellendus quae ea et, officiis dolores nihil asperiores
            est, sapiente dignissimos laudantium. Quod temporibus deleniti quae
            impedit expedita ex et earum?
          </div>
          <div className="cards">
            <div className="card">1</div>
            <div className="card">2</div>
            <div className="card">3</div>
            <div className="card">4</div>
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
