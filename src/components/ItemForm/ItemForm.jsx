import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";
import { addItem } from "../../Service/ItemService";

const ItemForm = () => {
  const { categories, setItemsData, itemsData, setCategories } =
    useContext(AppContext);

  const [image, setImage] = useState(false);

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    categoryId: "",
    price: "",
    description: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    // formData.append("item",data);  // --- Error
    formData.append("item", JSON.stringify(data));
    formData.append("image", image);
    try {
      if (!image) {
        toast.error("Select Image");
        return;
      }
      const response = await addItem(formData);
      if (response.status === 201) {
        setItemsData([...itemsData, response.data]);

        // Update category item count and no refresh needed.
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.categoryId === data.categoryId
              ? { ...category, items: category.items + 1 }
              : category,
          ),
        );
        toast.success("Item added");
        setData({
          name: "",
          categoryId: "",
          price: "",
          description: "",
        });
        setImage(false);
      } else {
        toast.error("Unable to add item");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to add item");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="item-form-container"
      style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}
    >
      <div className="mx-2 mt-2">
        <div className="row">
          <div className="card col-md-8 form-container">
            <div className="card-body">
              <form onSubmit={onSubmitHandler}>
                {/* To put image and input type in same line.
              d-flex align-items-center gap-3 */}
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    <img
                      src={image ? URL.createObjectURL(image) : assets.upload}
                      alt="image"
                      width={48}
                    />
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    className="form-control"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="Item Name"
                    onChange={onChangeHandler}
                    value={data.name}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    id="category"
                    className="form-control"
                    onChange={onChangeHandler}
                    value={data.categoryId}
                  >
                    <option value="">--SELECT CATEGORY--</option>
                    {/* <option value="Category 1">Category 1</option>
                    <option value="Category 2">Category 2</option> */}
                    {categories.map((category, index) => (
                      <option value={category.categoryId} key={index}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="form-control"
                    placeholder="&#8377;000.00"
                    onChange={onChangeHandler}
                    value={data.price}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    id="description"
                    name="description"
                    className="form-control"
                    placeholder="Write Content Here..."
                    onChange={onChangeHandler}
                    value={data.description}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Save"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
