const CategoryForm = () => {
  return (
    <div className="mx-2 mt-2">
      <div className="row">
        <div className="card col-md-8 form-container">
          <diiv className="card-body">
            <form>
              {/* To put image and input type in same line.
              d-flex align-items-center gap-3 */}
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  <img src="https://placehold.co/48" alt="image" width={48} />
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="form-control"
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
                  placeholder="Category Name"
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
                ></textarea>
              </div>
              {/* For Changing background Color. */}
              <div className="mb-3">
                <label htmlFor="bgcolor" className="form-label">
                  Background Color
                </label>
                <br />
                <input
                  type="color"
                  name="bgColor"
                  id="bgcolor"
                  placeholder="#ffffff"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Save</button>
            </form>
          </diiv>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
