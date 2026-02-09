// Validation middleware for different endpoints

export const validateDestination = (req, res, next) => {
  const { title, img, image, description, price, duration, groupSize, categoryId } = req.body;
  if (!req.body.img && image) req.body.img = image;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title is required");
  }

  if ((!img || String(img).trim().length === 0) && (!image || String(image).trim().length === 0)) {
    errors.push("Image URL is required");
  }
  
  if (!description || description.trim().length === 0) {
    errors.push("Description is required");
  }
  
  if (!price || price.trim().length === 0) {
    errors.push("Price is required");
  }
  
  if (!duration || duration.trim().length === 0) {
    errors.push("Duration is required");
  }
  
  if (!groupSize || String(groupSize).trim().length === 0) {
    req.body.groupSize = "Up to 15";
  }
  
  if (!categoryId || categoryId.trim().length === 0) {
    errors.push("Category ID is required");
  }
  
  if (!req.body.about || String(req.body.about).trim().length === 0) {
    req.body.about = req.body.description || "See description.";
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};

export const validateCategory = (req, res, next) => {
  const { name, slug } = req.body;
  
  const errors = [];
  
  if (!name || name.trim().length === 0) {
    errors.push("Category name is required");
  }
  
  if (slug && slug.trim().length === 0) {
    errors.push("Slug cannot be empty if provided");
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};

export const validateEnquiry = (req, res, next) => {
  const { customerName, name, email, phone } = req.body;
  const finalName = customerName || name;
  const errors = [];

  if (!finalName || String(finalName).trim().length === 0) {
    errors.push("Customer name is required");
  }
  
  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format");
  }
  
  if (!phone || phone.trim().length === 0) {
    errors.push("Phone number is required");
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};

export const validateItinerary = (req, res, next) => {
  const { destinationId, day, title, desc } = req.body;
  
  const errors = [];
  
  if (!destinationId || destinationId.trim().length === 0) {
    errors.push("Destination ID is required");
  }
  
  if (!day || isNaN(day) || parseInt(day) < 1) {
    errors.push("Valid day number is required");
  }
  
  if (!title || title.trim().length === 0) {
    errors.push("Title is required");
  }
  
  if (!desc || desc.trim().length === 0) {
    errors.push("Description is required");
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};

// Login: only email + password (used by admin panel and frontend)
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }
  next();
};

export const validateAdmin = (req, res, next) => {
  const { username, email, password } = req.body;
  
  const errors = [];
  
  if (!username || username.trim().length === 0) {
    errors.push("Username is required");
  }
  
  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format");
  }
  
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};
