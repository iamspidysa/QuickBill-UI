import { useContext } from 'react';
import './Explore.css';
import { AppContext } from '../../Context/AppContext';

const Explore = () => {

  const { categories } = useContext(AppContext);
  console.log(categories);
  

  return (
    <div className="expore-container text-light">
      <div className="left-column">
        <div className="first-row" style={{ overflowY: "auto" }}>
          Category
        </div>
        <hr className="horizontal-line" />
        <div className="second-row" style={{ overflowY: "auto" }}>
          Item
        </div>
      </div>

      <div className="right-column d-flex flex-column">
        <div
          className="customer-form-container"
          style={{ height: "15%"}}
        >
          Customer Form
        </div>
        <hr className="my-3 text-light" />
        <div
          className="cart-item-container"
          style={{
            height: "55%",
            overflowY: "auto",
            
          }}
        >
          Cart Item
        </div>
        <div
          className="cart-summary-container"
          style={{ height: "30%"}}
        >
          Cart Summary
        </div>
      </div>
    </div>
  );
};

export default Explore;
