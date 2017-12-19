import React from 'react';
import Modal from 'react-modal';
import "~/src/css/DetailsPopup.css"

class PopupAcceptProgressionTree extends React.Component {
    constructor(props) {
      super(props);

      this.modalDefaultStyles = {};
    }

    componentWillMount() {
      console.log("DetailsPopup::componentWillMount");
      this.modalDefaultStyles = Modal.defaultStyles;

      Modal.defaultStyles.content.border = "7px solid grey";
      Modal.defaultStyles.content.background = "transparent";
      Modal.defaultStyles.content.overflow = "visible";
      Modal.defaultStyles.content.padding = '0';
      Modal.defaultStyles.content["minWidth"] = '260px';
      Modal.defaultStyles.content["maxWidth"] = '800px';
      Modal.defaultStyles.content["minHeight"] = '500px';
      Modal.defaultStyles.content["marginLeft"] = 'auto';
      Modal.defaultStyles.content["marginRight"] = 'auto';
      Modal.defaultStyles.content["left"] = '0';
      Modal.defaultStyles.content["right"] = '0';
      Modal.defaultStyles.content["width"] = '800px';
    }

    componentWillUnmount() {
      console.log("DetailsPopup::componentWillUnmount");
      Modal.defaultStyles = this.modalDefaultStyles;
    }

    render() {
        return (
        <Modal isOpen={this.props.modalIsOpen} onRequestClose={() => this.props.onConfirmationPopupClose(false, this.props.treeName)} 
          contentLabel={this.props.treeId}>
           <div className="container-fluid default-popup-details">
             <div className="row">
               <div className="col-lg-12">
                 <p>Progression Tree Accept</p>
               </div>
             </div>
          <div className="row">
            <div className="col-lg-12">
              <p>Do you really want to accept "{this.props.treeName}" ?</p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <button type="button" className="btn btn-lg btn-outline-inverse" 
                    onClick={() => this.props.onConfirmationPopupClose(true, this.props.treeId)}>Yes</button>
              <button type="button" className="btn btn-lg btn-outline-inverse" 
                    onClick={() => this.props.onConfirmationPopupClose(false, this.props.treeId)}>No</button>
            </div>
          </div>
        </div>
        </Modal>
        );
      }
  }

  export default require('react-click-outside')(PopupAcceptProgressionTree);