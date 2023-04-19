import React from 'react';

const Modal = ({ handleClose, show, children, searchValue, peopleSearch, modalText}) => {
  if(show){
    return (
      <div className="modal is-active">
        <div className="modal-background">
          <div className="modal-content">
            <header className="modal-card-head modal-search">
                <div className='field has-addons modal-search-bar'>
                  <div className="control is-expanded">
                    <input className='input' placeholder="search people by name or netID" onChange={peopleSearch} type="text" />
                  </div>
                </div>
                <button className="button is-yellow modal-button"  type="button" onClick={handleClose}>
                  Done
                </button>
            </header>
            <section className="modal-card-body">
              <p> {modalText}</p>
              {children}
            </section>
          </div>
        </div>
      </div>
    );
  }else{
    return <div></div>;
  } 
};

export default Modal