const Legal = require("../models/Legal");

// GET /legal/articles
const getArticles = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const articles = await Legal.find(filter).lean();
    res.json({ success: true, count: articles.length, data: articles });
  } catch (err) { next(err); }
};

// GET /legal/search?q=keyword
const searchArticles = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) { res.status(400); throw new Error("query parameter q is required"); }

    // Full-text search using the text index
    const articles = await Legal.find({ $text: { $search: q } })
      .select({ score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .lean();

    res.json({ success: true, count: articles.length, data: articles });
  } catch (err) { next(err); }
};

// GET /legal/safety-guidelines
const getSafetyGuidelines = async (req, res, next) => {
  try {
    const articles = await Legal.find({ category: "safety" }).lean();
    res.json({ success: true, count: articles.length, data: articles });
  } catch (err) { next(err); }
};

// POST /legal/seed — run once to populate legal content
const seedLegal = async (req, res, next) => {
  try {
    await Legal.deleteMany({});
    const articles = [
      {
        title: "How to Get a Street Vending License",
        category: "license",
        content: "Street vendors must apply for a vending permit at the Municipal Corporation office. Required documents include: ID proof, address proof, passport-size photographs, and payment of the prescribed fee. The license must be renewed annually and must be displayed at the vending cart at all times.",
        tags: ["license", "permit", "municipal", "registration"],
      },
      {
        title: "Know Your Rights as a Street Vendor",
        category: "rights",
        content: "Under the Street Vendors (Protection of Livelihood and Regulation of Street Vending) Act 2014, every vendor has the right to a Certificate of Vending, protection from eviction without notice, and the right to appeal to a Town Vending Committee. Police cannot seize goods without legal authority.",
        tags: ["rights", "law", "eviction", "protection", "act 2014"],
      },
      {
        title: "Food Safety Standards for Vendors",
        category: "safety",
        content: "All food vendors must maintain clean preparation areas, use potable water, store food at appropriate temperatures, and obtain a basic FSSAI registration. Cooked food should not be left uncovered for more than 2 hours. Regular handwashing is mandatory.",
        tags: ["food safety", "FSSAI", "hygiene", "health"],
      },
      {
        title: "Harassment and Eviction Protections",
        category: "rights",
        content: "No vendor shall be evicted or have goods seized without a 30-day prior notice and a hearing before the Town Vending Committee. Any police officer who seizes goods without cause can be reported to the Grievance Redressal Committee.",
        tags: ["harassment", "eviction", "police", "rights", "grievance"],
      },
      {
        title: "Fire Safety at Your Vending Spot",
        category: "safety",
        content: "Vendors using cooking equipment must keep a fire extinguisher nearby, maintain a minimum 3-foot clearance from flammable materials, and ensure LPG cylinders are upright and capped when not in use. Never use damaged hoses or faulty regulators.",
        tags: ["fire", "safety", "LPG", "cooking", "emergency"],
      },
      {
        title: "Tax and GST for Small Vendors",
        category: "license",
        content: "Vendors earning below Rs 20 lakh per year are exempt from GST registration. However, keeping basic income records is advisable. You can register for a Udyam (MSME) certificate to access government schemes and subsidies.",
        tags: ["tax", "GST", "income", "MSME", "exemption"],
      },
    ];

    await Legal.insertMany(articles);
    res.json({ success: true, message: `${articles.length} legal articles seeded` });
  } catch (err) { next(err); }
};

module.exports = { getArticles, searchArticles, getSafetyGuidelines, seedLegal };
