export const getDashboard = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        user: req.user, // Assuming auth middleware sets req.user
        stats: {
          totalSimulations: 12,
          completed: 8,
          pending: 4,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
      error: error.message,
    });
  }
};