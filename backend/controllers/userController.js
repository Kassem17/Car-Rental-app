import Review from "../models/Review.js";

export const submitReview = async (req, res) => {
  try {
    const { rating, comment, userName } = req.body;
    const newReview = new Review({
      userName,
      rating,
      comment,
    });
    await newReview.save();
    res
      .status(200)
      .json({ success: true, message: "Review submitted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in submitting review", error });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();

    res.status(200).json({ success: true, message: "reviews", reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in getting review", error });
  }
};
