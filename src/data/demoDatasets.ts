import { Dataset, ColumnProfile } from '../types';

// Helper to generate realistic date ranges
function generateDates(monthsCount: number, startYear = 2025): string[] {
  const dates: string[] = [];
  for (let m = 0; m < monthsCount; m++) {
    const month = (m % 12) + 1;
    const year = startYear + Math.floor(m / 12);
    const day = ((m * 7) % 27) + 1;
    dates.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }
  return dates;
}

// 1. E-COMMERCE SALES DATASET (50 realistic records with metrics, anomalies, and categories)
const rawEcommerceData = [
  { order_id: "ORD-1001", date: "2025-01-04", customer_segment: "Enterprise", category: "Technology", subcategory: "Laptops", region: "North America", sales: 2499.00, quantity: 2, discount: 0.05, profit: 450.20, returned: "No" },
  { order_id: "ORD-1002", date: "2025-01-08", customer_segment: "Consumer", category: "Furniture", subcategory: "Office Chairs", region: "Europe", sales: 420.50, quantity: 1, discount: 0.10, profit: 84.10, returned: "No" },
  { order_id: "ORD-1003", date: "2025-01-12", customer_segment: "Corporate", category: "Office Supplies", subcategory: "Paper & Print", region: "Asia Pacific", sales: 185.00, quantity: 5, discount: 0.00, profit: 62.00, returned: "No" },
  { order_id: "ORD-1004", date: "2025-01-17", customer_segment: "Consumer", category: "Technology", subcategory: "Smartphones", region: "North America", sales: 1199.99, quantity: 1, discount: 0.00, profit: 320.00, returned: "Yes" },
  { order_id: "ORD-1005", date: "2025-01-22", customer_segment: "Enterprise", category: "Technology", subcategory: "Cloud Servers", region: "North America", sales: 8500.00, quantity: 4, discount: 0.15, profit: 2100.00, returned: "No" },
  { order_id: "ORD-1006", date: "2025-01-28", customer_segment: "Consumer", category: "Furniture", subcategory: "Standing Desks", region: "Latin America", sales: 750.00, quantity: 1, discount: 0.20, profit: 95.00, returned: "No" },
  { order_id: "ORD-1007", date: "2025-02-02", customer_segment: "Corporate", category: "Office Supplies", subcategory: "Binders", region: "Europe", sales: 89.50, quantity: 3, discount: 0.00, profit: 24.50, returned: "No" },
  { order_id: "ORD-1008", date: "2025-02-07", customer_segment: "Enterprise", category: "Technology", subcategory: "Laptops", region: "Asia Pacific", sales: 3600.00, quantity: 3, discount: 0.08, profit: 620.00, returned: "No" },
  { order_id: "ORD-1009", date: "2025-02-14", customer_segment: "Consumer", category: "Office Supplies", subcategory: "Writing Gear", region: "North America", sales: 45.00, quantity: 2, discount: 0.00, profit: 18.00, returned: "No" },
  { order_id: "ORD-1010", date: "2025-02-19", customer_segment: "Corporate", category: "Technology", subcategory: "Monitors", region: "Europe", sales: 1250.00, quantity: 2, discount: 0.05, profit: 280.00, returned: "No" },
  { order_id: "ORD-1011", date: "2025-02-24", customer_segment: "Enterprise", category: "Furniture", subcategory: "Bookcases", region: "North America", sales: 890.00, quantity: 2, discount: 0.10, profit: 120.00, returned: "No" },
  { order_id: "ORD-1012", date: "2025-03-01", customer_segment: "Consumer", category: "Technology", subcategory: "Laptops", region: "Europe", sales: 1850.00, quantity: 1, discount: 0.00, profit: 390.00, returned: "No" },
  { order_id: "ORD-1013", date: "2025-03-06", customer_segment: "Corporate", category: "Office Supplies", subcategory: "Storage", region: "Asia Pacific", sales: 310.00, quantity: 4, discount: 0.05, profit: 75.00, returned: "No" },
  { order_id: "ORD-1014", date: "2025-03-12", customer_segment: "Consumer", category: "Furniture", subcategory: "Office Chairs", region: "North America", sales: 550.00, quantity: 1, discount: 0.00, profit: 110.00, returned: "No" },
  // Subtle anomaly / big enterprise order
  { order_id: "ORD-1015", date: "2025-03-18", customer_segment: "Enterprise", category: "Technology", subcategory: "Cloud Servers", region: "North America", sales: 19800.00, quantity: 8, discount: 0.25, profit: 5400.00, returned: "No" },
  { order_id: "ORD-1016", date: "2025-03-24", customer_segment: "Corporate", category: "Office Supplies", subcategory: "Paper & Print", region: "Europe", sales: 220.00, quantity: 6, discount: 0.00, profit: 72.00, returned: "No" },
  { order_id: "ORD-1017", date: "2025-03-29", customer_segment: "Consumer", category: "Technology", subcategory: "Accessories", region: "Latin America", sales: 140.00, quantity: 2, discount: 0.10, profit: 45.00, returned: "Yes" },
  { order_id: "ORD-1018", date: "2025-04-03", customer_segment: "Enterprise", category: "Furniture", subcategory: "Conference Tables", region: "North America", sales: 4200.00, quantity: 2, discount: 0.12, profit: 890.00, returned: "No" },
  { order_id: "ORD-1019", date: "2025-04-09", customer_segment: "Corporate", category: "Technology", subcategory: "Smartphones", region: "Asia Pacific", sales: 2400.00, quantity: 2, discount: 0.00, profit: 640.00, returned: "No" },
  { order_id: "ORD-1020", date: "2025-04-15", customer_segment: "Consumer", category: "Office Supplies", subcategory: "Art Supplies", region: "North America", sales: 78.00, quantity: 3, discount: 0.00, profit: 26.00, returned: "No" },
  { order_id: "ORD-1021", date: "2025-04-21", customer_segment: "Enterprise", category: "Technology", subcategory: "Laptops", region: "Europe", sales: 5200.00, quantity: 4, discount: 0.10, profit: 980.00, returned: "No" },
  { order_id: "ORD-1022", date: "2025-04-26", customer_segment: "Corporate", category: "Furniture", subcategory: "Office Chairs", region: "North America", sales: 880.00, quantity: 2, discount: 0.05, profit: 190.00, returned: "No" },
  { order_id: "ORD-1023", date: "2025-05-02", customer_segment: "Consumer", category: "Technology", subcategory: "Monitors", region: "Asia Pacific", sales: 650.00, quantity: 1, discount: 0.00, profit: 145.00, returned: "No" },
  { order_id: "ORD-1024", date: "2025-05-08", customer_segment: "Corporate", category: "Office Supplies", subcategory: "Binders", region: "Latin America", sales: 112.00, quantity: 4, discount: 0.00, profit: 34.00, returned: "No" },
  { order_id: "ORD-1025", date: "2025-05-14", customer_segment: "Enterprise", category: "Technology", subcategory: "Cloud Servers", region: "Europe", sales: 12400.00, quantity: 5, discount: 0.18, profit: 3100.00, returned: "No" },
  { order_id: "ORD-1026", date: "2025-05-20", customer_segment: "Consumer", category: "Furniture", subcategory: "Standing Desks", region: "North America", sales: 1450.00, quantity: 2, discount: 0.15, profit: 210.00, returned: "No" },
  { order_id: "ORD-1027", date: "2025-05-25", customer_segment: "Corporate", category: "Office Supplies", subcategory: "Paper & Print", region: "Europe", sales: 290.00, quantity: 8, discount: 0.00, profit: 92.00, returned: "No" },
  { order_id: "ORD-1028", date: "2025-05-31", customer_segment: "Consumer", category: "Technology", subcategory: "Smartphones", region: "North America", sales: 1250.00, quantity: 1, discount: 0.00, profit: 330.00, returned: "No" },
  { order_id: "ORD-1029", date: "2025-06-05", customer_segment: "Enterprise", category: "Technology", subcategory: "Laptops", region: "North America", sales: 6400.00, quantity: 5, discount: 0.10, profit: 1220.00, returned: "No" },
  { order_id: "ORD-1030", date: "2025-06-11", customer_segment: "Corporate", category: "Furniture", subcategory: "Conference Tables", region: "Asia Pacific", sales: 3800.00, quantity: 2, discount: 0.10, profit: 790.00, returned: "No" },
  { order_id: "ORD-1031", date: "2025-06-16", customer_segment: "Consumer", category: "Office Supplies", subcategory: "Storage", region: "North America", sales: 175.00, quantity: 2, discount: 0.00, profit: 42.00, returned: "No" },
  { order_id: "ORD-1032", date: "2025-06-22", customer_segment: "Enterprise", category: "Technology", subcategory: "Monitors", region: "Europe", sales: 2500.00, quantity: 4, discount: 0.05, profit: 580.00, returned: "No" },
  { order_id: "ORD-1033", date: "2025-06-28", customer_segment: "Consumer", category: "Furniture", subcategory: "Office Chairs", region: "North America", sales: 490.00, quantity: 1, discount: 0.00, profit: 102.00, returned: "Yes" },
  { order_id: "ORD-1034", date: "2025-07-04", customer_segment: "Corporate", category: "Technology", subcategory: "Accessories", region: "Europe", sales: 320.00, quantity: 4, discount: 0.00, profit: 98.00, returned: "No" },
  { order_id: "ORD-1035", date: "2025-07-10", customer_segment: "Enterprise", category: "Technology", subcategory: "Cloud Servers", region: "North America", sales: 15600.00, quantity: 6, discount: 0.20, profit: 3950.00, returned: "No" },
  { order_id: "ORD-1036", date: "2025-07-16", customer_segment: "Consumer", category: "Office Supplies", subcategory: "Writing Gear", region: "Asia Pacific", sales: 62.00, quantity: 3, discount: 0.00, profit: 21.00, returned: "No" },
  { order_id: "ORD-1037", date: "2025-07-22", customer_segment: "Corporate", category: "Furniture", subcategory: "Bookcases", region: "Europe", sales: 940.00, quantity: 2, discount: 0.05, profit: 140.00, returned: "No" },
  { order_id: "ORD-1038", date: "2025-07-28", customer_segment: "Consumer", category: "Technology", subcategory: "Laptops", region: "North America", sales: 1950.00, quantity: 1, discount: 0.00, profit: 410.00, returned: "No" },
  { order_id: "ORD-1039", date: "2025-08-03", customer_segment: "Enterprise", category: "Technology", subcategory: "Smartphones", region: "Europe", sales: 4800.00, quantity: 4, discount: 0.05, profit: 1250.00, returned: "No" },
  { order_id: "ORD-1040", date: "2025-08-09", customer_segment: "Corporate", category: "Office Supplies", subcategory: "Paper & Print", region: "North America", sales: 340.00, quantity: 9, discount: 0.00, profit: 108.00, returned: "No" },
  { order_id: "ORD-1041", date: "2025-08-15", customer_segment: "Consumer", category: "Furniture", subcategory: "Standing Desks", region: "Asia Pacific", sales: 820.00, quantity: 1, discount: 0.10, profit: 115.00, returned: "No" },
  { order_id: "ORD-1042", date: "2025-08-21", customer_segment: "Enterprise", category: "Technology", subcategory: "Cloud Servers", region: "North America", sales: 17200.00, quantity: 7, discount: 0.15, profit: 4400.00, returned: "No" },
  { order_id: "ORD-1043", date: "2025-08-27", customer_segment: "Corporate", category: "Furniture", subcategory: "Office Chairs", region: "Europe", sales: 1350.00, quantity: 3, discount: 0.05, profit: 290.00, returned: "No" },
  { order_id: "ORD-1044", date: "2025-09-02", customer_segment: "Consumer", category: "Technology", subcategory: "Accessories", region: "North America", sales: 210.00, quantity: 3, discount: 0.00, profit: 68.00, returned: "No" },
  { order_id: "ORD-1045", date: "2025-09-08", customer_segment: "Enterprise", category: "Office Supplies", subcategory: "Storage", region: "Asia Pacific", sales: 580.00, quantity: 6, discount: 0.05, profit: 135.00, returned: "No" },
  { order_id: "ORD-1046", date: "2025-09-14", customer_segment: "Corporate", category: "Technology", subcategory: "Laptops", region: "North America", sales: 4900.00, quantity: 4, discount: 0.08, profit: 990.00, returned: "No" },
  { order_id: "ORD-1047", date: "2025-09-20", customer_segment: "Consumer", category: "Furniture", subcategory: "Conference Tables", region: "Europe", sales: 2200.00, quantity: 1, discount: 0.10, profit: 440.00, returned: "No" },
  { order_id: "ORD-1048", date: "2025-09-26", customer_segment: "Enterprise", category: "Technology", subcategory: "Monitors", region: "North America", sales: 3800.00, quantity: 6, discount: 0.05, profit: 890.00, returned: "No" },
  { order_id: "ORD-1049", date: "2025-10-02", customer_segment: "Corporate", category: "Office Supplies", subcategory: "Art Supplies", region: "Latin America", sales: 145.00, quantity: 4, discount: 0.00, profit: 48.00, returned: "No" },
  { order_id: "ORD-1050", date: "2025-10-08", customer_segment: "Enterprise", category: "Technology", subcategory: "Cloud Servers", region: "North America", sales: 22400.00, quantity: 9, discount: 0.22, profit: 5900.00, returned: "No" }
];

// 2. CUSTOMER ANALYTICS DATASET
const rawCustomerData = [
  { customer_id: "CUST-801", channel: "Organic Search", tenure_months: 24, monthly_spend: 185.50, support_tickets: 1, churn_risk_score: 0.12, nps_score: 9, lifetime_value: 4450.00, plan: "Pro" },
  { customer_id: "CUST-802", channel: "Paid Social", tenure_months: 6, monthly_spend: 65.00, support_tickets: 4, churn_risk_score: 0.68, nps_score: 6, lifetime_value: 390.00, plan: "Starter" },
  { customer_id: "CUST-803", channel: "Direct Referral", tenure_months: 36, monthly_spend: 480.00, support_tickets: 0, churn_risk_score: 0.05, nps_score: 10, lifetime_value: 17280.00, plan: "Enterprise" },
  { customer_id: "CUST-804", channel: "Google Ads", tenure_months: 12, monthly_spend: 120.00, support_tickets: 2, churn_risk_score: 0.35, nps_score: 7, lifetime_value: 1440.00, plan: "Growth" },
  { customer_id: "CUST-805", channel: "Organic Search", tenure_months: 18, monthly_spend: 210.00, support_tickets: 1, churn_risk_score: 0.18, nps_score: 8, lifetime_value: 3780.00, plan: "Pro" },
  { customer_id: "CUST-806", channel: "Paid Social", tenure_months: 4, monthly_spend: 55.00, support_tickets: 5, churn_risk_score: 0.82, nps_score: 4, lifetime_value: 220.00, plan: "Starter" },
  { customer_id: "CUST-807", channel: "Events/Webinar", tenure_months: 30, monthly_spend: 650.00, support_tickets: 2, churn_risk_score: 0.08, nps_score: 9, lifetime_value: 19500.00, plan: "Enterprise" },
  { customer_id: "CUST-808", channel: "Google Ads", tenure_months: 9, monthly_spend: 145.00, support_tickets: 3, churn_risk_score: 0.44, nps_score: 7, lifetime_value: 1305.00, plan: "Growth" },
  { customer_id: "CUST-809", channel: "Direct Referral", tenure_months: 42, monthly_spend: 520.00, support_tickets: 1, churn_risk_score: 0.04, nps_score: 10, lifetime_value: 21840.00, plan: "Enterprise" },
  { customer_id: "CUST-810", channel: "Organic Search", tenure_months: 15, monthly_spend: 195.00, support_tickets: 2, churn_risk_score: 0.22, nps_score: 8, lifetime_value: 2925.00, plan: "Pro" },
  { customer_id: "CUST-811", channel: "Paid Social", tenure_months: 8, monthly_spend: 70.00, support_tickets: 3, churn_risk_score: 0.58, nps_score: 6, lifetime_value: 560.00, plan: "Starter" },
  { customer_id: "CUST-812", channel: "Events/Webinar", tenure_months: 28, monthly_spend: 490.00, support_tickets: 1, churn_risk_score: 0.10, nps_score: 9, lifetime_value: 13720.00, plan: "Enterprise" },
  { customer_id: "CUST-813", channel: "Google Ads", tenure_months: 14, monthly_spend: 130.00, support_tickets: 2, churn_risk_score: 0.30, nps_score: 8, lifetime_value: 1820.00, plan: "Growth" },
  { customer_id: "CUST-814", channel: "Direct Referral", tenure_months: 32, monthly_spend: 460.00, support_tickets: 0, churn_risk_score: 0.06, nps_score: 10, lifetime_value: 14720.00, plan: "Enterprise" },
  { customer_id: "CUST-815", channel: "Organic Search", tenure_months: 20, monthly_spend: 225.00, support_tickets: 1, churn_risk_score: 0.15, nps_score: 9, lifetime_value: 4500.00, plan: "Pro" }
];

// 3. MARKETING CAMPAIGNS DATASET
const rawMarketingData = [
  { campaign: "Q1 Brand Elevation", platform: "LinkedIn Ads", spend: 12500, impressions: 450000, clicks: 8100, conversions: 290, revenue_generated: 48500, cac: 43.10, roas: 3.88 },
  { campaign: "Spring SaaS Launch", platform: "Google Search", spend: 18000, impressions: 820000, clicks: 19500, conversions: 620, revenue_generated: 89000, cac: 29.03, roas: 4.94 },
  { campaign: "Productivity Hacks", platform: "YouTube Pre-roll", spend: 9500, impressions: 640000, clicks: 6200, conversions: 140, revenue_generated: 22400, cac: 67.85, roas: 2.35 },
  { campaign: "Retargeting Cart Drop", platform: "Meta Ads", spend: 6800, impressions: 210000, clicks: 9400, conversions: 410, revenue_generated: 56000, cac: 16.58, roas: 8.23 },
  { campaign: "AI Tools Guidebook", platform: "Content Syndication", spend: 4500, impressions: 180000, clicks: 3900, conversions: 185, revenue_generated: 28900, cac: 24.32, roas: 6.42 },
  { campaign: "DevOps Summit Push", platform: "Twitter / X", spend: 7200, impressions: 380000, clicks: 5400, conversions: 110, revenue_generated: 16500, cac: 65.45, roas: 2.29 },
  { campaign: "Midyear Enterprise", platform: "LinkedIn Ads", spend: 24000, impressions: 590000, clicks: 12400, conversions: 480, revenue_generated: 132000, cac: 50.00, roas: 5.50 },
  { campaign: "Black Friday Earlybird", platform: "Google Search", spend: 22000, impressions: 980000, clicks: 28400, conversions: 910, revenue_generated: 145000, cac: 24.17, roas: 6.59 },
  { campaign: "Webinar Growth Loops", platform: "Email Sponsored", spend: 3800, impressions: 95000, clicks: 4200, conversions: 240, revenue_generated: 34200, cac: 15.83, roas: 9.00 },
  { campaign: "Customer Referral Promo", platform: "Direct / In-App", spend: 2500, impressions: 65000, clicks: 7800, conversions: 380, revenue_generated: 49800, cac: 6.58, roas: 19.92 }
];

// 4. EMPLOYEE ANALYTICS DATASET
const rawEmployeeData = [
  { employee_id: "EMP-101", department: "Engineering", job_level: "Senior", salary: 145000, performance_rating: 4.8, years_at_company: 4.5, overtime_hours: 12, attrition_risk: "Low" },
  { employee_id: "EMP-102", department: "Sales", job_level: "Mid", salary: 85000, performance_rating: 3.9, years_at_company: 2.1, overtime_hours: 38, attrition_risk: "High" },
  { employee_id: "EMP-103", department: "Product", job_level: "Lead", salary: 165000, performance_rating: 4.9, years_at_company: 5.8, overtime_hours: 8, attrition_risk: "Low" },
  { employee_id: "EMP-104", department: "Customer Support", job_level: "Junior", salary: 52000, performance_rating: 3.4, years_at_company: 1.2, overtime_hours: 45, attrition_risk: "High" },
  { employee_id: "EMP-105", department: "Engineering", job_level: "Staff", salary: 185000, performance_rating: 4.9, years_at_company: 6.2, overtime_hours: 5, attrition_risk: "Low" },
  { employee_id: "EMP-106", department: "Marketing", job_level: "Senior", salary: 110000, performance_rating: 4.2, years_at_company: 3.4, overtime_hours: 15, attrition_risk: "Medium" },
  { employee_id: "EMP-107", department: "Sales", job_level: "Director", salary: 175000, performance_rating: 4.6, years_at_company: 4.9, overtime_hours: 22, attrition_risk: "Low" },
  { employee_id: "EMP-108", department: "Finance", job_level: "Senior", salary: 125000, performance_rating: 4.4, years_at_company: 3.8, overtime_hours: 18, attrition_risk: "Low" },
  { employee_id: "EMP-109", department: "Engineering", job_level: "Junior", salary: 92000, performance_rating: 3.8, years_at_company: 1.0, overtime_hours: 24, attrition_risk: "Medium" },
  { employee_id: "EMP-110", department: "Design", job_level: "Mid", salary: 98000, performance_rating: 4.3, years_at_company: 2.8, overtime_hours: 10, attrition_risk: "Low" }
];

// 5. INVENTORY & SUPPLY CHAIN DATASET
const rawInventoryData = [
  { sku: "SKU-PRO-401", product_name: "Ultra HD Monitor 34-inch", category: "Displays", stock_on_hand: 42, reorder_point: 30, unit_cost: 320.00, selling_price: 549.99, lead_time_days: 14, monthly_demand: 75, stockout_risk: "Moderate" },
  { sku: "SKU-PRO-402", product_name: "Mechanical Ergonomic Keyboard", category: "Peripherals", stock_on_hand: 185, reorder_point: 50, unit_cost: 45.00, selling_price: 119.00, lead_time_days: 7, monthly_demand: 90, stockout_risk: "Low" },
  { sku: "SKU-PRO-403", product_name: "Thunderbolt 4 Docking Station", category: "Accessories", stock_on_hand: 14, reorder_point: 25, unit_cost: 110.00, selling_price: 229.00, lead_time_days: 21, monthly_demand: 60, stockout_risk: "Critical" },
  { sku: "SKU-PRO-404", product_name: "Noise-Cancelling Studio Headset", category: "Audio", stock_on_hand: 92, reorder_point: 40, unit_cost: 85.00, selling_price: 199.99, lead_time_days: 10, monthly_demand: 80, stockout_risk: "Low" },
  { sku: "SKU-PRO-405", product_name: "Enterprise Mesh WiFi Node", category: "Networking", stock_on_hand: 28, reorder_point: 35, unit_cost: 140.00, selling_price: 289.00, lead_time_days: 18, monthly_demand: 55, stockout_risk: "High" },
  { sku: "SKU-PRO-406", product_name: "Adjustable Desk Stand Converter", category: "Furniture", stock_on_hand: 65, reorder_point: 20, unit_cost: 95.00, selling_price: 210.00, lead_time_days: 12, monthly_demand: 35, stockout_risk: "Low" }
];

// 6. FINANCIAL PERFORMANCE DATASET
const rawFinancialData = [
  { quarter: "2024-Q1", revenue: 1450000, cogs: 490000, operating_expenses: 620000, net_profit: 340000, ebitda: 410000, gross_margin_pct: 66.2, free_cash_flow: 295000 },
  { quarter: "2024-Q2", revenue: 1680000, cogs: 560000, operating_expenses: 690000, net_profit: 430000, ebitda: 515000, gross_margin_pct: 66.7, free_cash_flow: 380000 },
  { quarter: "2024-Q3", revenue: 1890000, cogs: 615000, operating_expenses: 745000, net_profit: 530000, ebitda: 620000, gross_margin_pct: 67.5, free_cash_flow: 460000 },
  { quarter: "2024-Q4", revenue: 2350000, cogs: 750000, operating_expenses: 880000, net_profit: 720000, ebitda: 840000, gross_margin_pct: 68.1, free_cash_flow: 640000 },
  { quarter: "2025-Q1", revenue: 2100000, cogs: 680000, operating_expenses: 820000, net_profit: 600000, ebitda: 710000, gross_margin_pct: 67.6, free_cash_flow: 530000 },
  { quarter: "2025-Q2", revenue: 2480000, cogs: 790000, operating_expenses: 910000, net_profit: 780000, ebitda: 905000, gross_margin_pct: 68.1, free_cash_flow: 695000 },
  { quarter: "2025-Q3", revenue: 2820000, cogs: 885000, operating_expenses: 990000, net_profit: 945000, ebitda: 1080000, gross_margin_pct: 68.6, free_cash_flow: 840000 },
  { quarter: "2025-Q4", revenue: 3450000, cogs: 1060000, operating_expenses: 1140000, net_profit: 1250000, ebitda: 1410000, gross_margin_pct: 69.3, free_cash_flow: 1120000 }
];

export interface DemoDatasetMeta {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  rows: number;
  columns: number;
  tags: string[];
  rawRows: Record<string, any>[];
}

export const DEMO_DATASETS: DemoDatasetMeta[] = [
  {
    id: "demo-ecommerce",
    name: "Global E-commerce Sales & Orders",
    category: "Sales & Retail",
    description: "Multinational multichannel order records with revenue, margin, discounts, shipping regions, and return status.",
    iconName: "ShoppingCart",
    rows: rawEcommerceData.length,
    columns: Object.keys(rawEcommerceData[0]).length,
    tags: ["Sales", "Profitability", "Region", "Discounts"],
    rawRows: rawEcommerceData
  },
  {
    id: "demo-customer",
    name: "Customer Retention & LTV",
    category: "Customer Success",
    description: "Cohorts, churn risk indices, monthly spend, support workload, Net Promoter Scores, and subscription tiers.",
    iconName: "Users",
    rows: rawCustomerData.length,
    columns: Object.keys(rawCustomerData[0]).length,
    tags: ["Churn", "LTV", "NPS", "Support"],
    rawRows: rawCustomerData
  },
  {
    id: "demo-marketing",
    name: "Multi-Channel Marketing ROI",
    category: "Growth & Acquisition",
    description: "Omnichannel performance advertising logs with impressions, click-throughs, CAC, conversions, and ROAS.",
    iconName: "Megaphone",
    rows: rawMarketingData.length,
    columns: Object.keys(rawMarketingData[0]).length,
    tags: ["ROAS", "CAC", "Conversions", "Spend"],
    rawRows: rawMarketingData
  },
  {
    id: "demo-employee",
    name: "Workforce & Talent Analytics",
    category: "Human Resources",
    description: "Departmental compensation, tenure, overtime burnout indicators, performance evaluations, and attrition risk.",
    iconName: "Briefcase",
    rows: rawEmployeeData.length,
    columns: Object.keys(rawEmployeeData[0]).length,
    tags: ["Attrition", "Compensation", "Performance"],
    rawRows: rawEmployeeData
  },
  {
    id: "demo-inventory",
    name: "Supply Chain & Stock Velocity",
    category: "Operations",
    description: "Warehouse stock levels, supplier lead times, reorder thresholds, monthly run rates, and stockout liabilities.",
    iconName: "Package",
    rows: rawInventoryData.length,
    columns: Object.keys(rawInventoryData[0]).length,
    tags: ["Lead Time", "Stockout Risk", "Reorder"],
    rawRows: rawInventoryData
  },
  {
    id: "demo-finance",
    name: "Executive Financial P&L",
    category: "Finance & Strategy",
    description: "Quarterly top-line expansion, EBITDA, gross margins, COGS, operating overhead, and free cash flows.",
    iconName: "TrendingUp",
    rows: rawFinancialData.length,
    columns: Object.keys(rawFinancialData[0]).length,
    tags: ["EBITDA", "Cash Flow", "Gross Margin"],
    rawRows: rawFinancialData
  }
];

export function loadDemoDataset(id: string): { id: string; name: string; data: Record<string, any>[] } {
  const match = DEMO_DATASETS.find(d => d.id === id) || DEMO_DATASETS[0];
  return {
    id: match.id,
    name: match.name,
    data: match.rawRows
  };
}

