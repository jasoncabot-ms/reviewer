const ReviewCard = ({ review: { createdBy, rating, text } }) => {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <div className="row">
                    <div className="col-md-10">
                        <p><strong>{createdBy}</strong> gave {rating} {rating === 1 ? "star" : "stars"}</p>
                        <div className="clearfix"></div>

                        <p>{text}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ReviewCard };
