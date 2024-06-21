import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeOffcanvas = (container) => {
    const content = document.querySelector(`.${container}`);
    if (content) {
      content.style.maxHeight = null;
    }
    setSidebarOpen(false);
  };

  const toggleCollapsible = (container) => {
    if (!sidebarOpen) return;

    let content;
    const button = document.querySelector(".collapsible");

    switch(container) {
      case 'content1':
        content = document.querySelector(".content1");
        break;
      case 'content2':
        content = document.querySelector(".content2");
        break;
      default:
        break;
    }

    if (button && content) {
      button.classList.toggle("active");
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg " style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', backgroundColor: '#b8b8ff' }}>
        <div className="container-fluid">
          <h4>
            <Link to="/" className="navbar-brand fs-2 fw-bold">
            <img  className="logo-img" src="bisag_logo.png" alt="logo" />
            </Link>
            <Link className="logo" to="/generaldetails">Home</Link>
          </h4> 
          <button className="btn" type="button" onClick={toggleSidebar} aria-controls="offcanvasExample">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      <div
        className={`offcanvas offcanvas-start ${sidebarOpen ? 'show' : ''}`}
        style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', backgroundColor: '#fff' }}
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-body">
          <div className="head">
            <h1>Data Quality</h1>
            <span>
              <button type="button" className="btn-close btn-close-white" onClick={() => closeOffcanvas()} aria-label="Close"></button>
            </span>
          </div>
          <hr />
          <Link className="links" to="/generaldetails" onClick={() => closeOffcanvas()}>
            <div className="hoverEffect">
            <span className="icons material-symbols-outlined">dashboard</span> DashBoard
            </div>
          </Link>

          <button className="collapsible hoverEffect" onClick={() => toggleCollapsible('content1')}>
            Completeness Checks<span className="material-symbols-outlined">chevron_right</span>
          </button>
          <div className="content content1">
            <div className="sub-categories">
              <Link className="links" to="/omission" onClick={() => closeOffcanvas('content1')}>
                <div className="hoverEffect">
                    Omission
                </div>
              </Link>
              <Link className="links" to="/comission" onClick={() => closeOffcanvas('content1')}>
              <div className="hoverEffect">
                  Comission
              </div>
              </Link>
            </div>
          </div>

          <button className="collapsible hoverEffect" onClick={() => toggleCollapsible('content2')}>
            Logical Consistency <span className="material-symbols-outlined">chevron_right</span>
          </button>
          <div className="content content2">
            <div className="sub-categories">
              <Link className="links" to="/formatconsistency" onClick={() => closeOffcanvas('content2')}>
                <div className="hoverEffect">
                  Format Consistency
                </div>
              </Link>
              <Link className="links" to="/domainconsistency" onClick={() => closeOffcanvas('content2')}>
                <div className="hoverEffect">
                  Domain Consistency
                </div>
              </Link>
            </div>
          </div>
          <Link className="links" to="/userdefined" onClick={() => closeOffcanvas('content2')} >
                <div className="hoverEffect">
                  UserDefined
                </div>
              </Link>

        </div>
      </div>
    </div>
  );
};

export default Navbar;