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
        <div className="title-box">
          <h1>This, is Focus</h1>
        </div>
        Focus Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam repellendus quae ea et, officiis dolores nihil asperiores est, sapiente dignissimos laudantium. Quod temporibus deleniti quae impedit expedita ex et earum?
      </div>
        </div>
      <footer className="footer-welcome">
        <p>Yes... Focus</p>

        <p>JD</p>
      </footer>
    </>
  )
}