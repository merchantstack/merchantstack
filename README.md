# Merchant Stack

Build a complete, premium, modern B2B digital commerce marketplace called MerchantStack.

BRAND POSITIONING

Brand name: MerchantStack

Tagline:
Commerce infrastructure for modern businesses.

MerchantStack is a digital marketplace that sells ecommerce software, merchant tools, SEO tools, marketing tools, product-feed tools, Shopify resources, licenses, themes, and other digital commerce solutions.

The website should look like a legitimate technology/software company and digital marketplace — NOT like a basic Gumroad clone.

Use a clean, premium, modern SaaS/ecommerce design with excellent typography, spacing, subtle animations, strong product cards, professional icons, and a highly responsive mobile experience.

Primary CTA:
Explore Products

Secondary CTA:
Talk to Us on WhatsApp

1. PRODUCT CATALOGUE IMPORT

Use the following publicly accessible reference stores as the initial product catalogue sources:

https://boostsuite.gumroad.com

https://megifytools.gumroad.com

https://www.coachli.co/zynox

Extract publicly available product information from these sources where permitted and where the products/assets are authorized for use.

Do NOT merely link visitors to those websites.

Create MerchantStack's own product catalogue using the available product information.

For every product that can be legitimately included, collect:

Product name

Product category

Product description

Short description

Full description

Price

Original price if available

Discount percentage if available

Product image

Product features

What's included

Product type

License information

Version information if available

Delivery method

Platform compatibility

Requirements

Tags

Product URL/reference

Featured status

Best seller status

New product status

If some information cannot be retrieved, DO NOT invent factual information. Instead, create sensible editable placeholder fields that can be completed from the admin dashboard.

IMPORTANT:

Every product must be stored as structured product data rather than hardcoded directly into the frontend.

2. PRODUCT DATABASE / CMS

Create a proper product management system.

Every product must be easily editable from an admin dashboard.

The administrator should be able to:

Add products

Edit products

Delete products

Duplicate products

Hide/show products

Mark products as featured

Mark products as bestseller

Mark products as new

Change prices

Change discounts

Change product images

Change descriptions

Change categories

Change tags

Change product features

Change license information

Change product requirements

Change WhatsApp purchase message

Change product availability

Change product delivery information

Do NOT require editing the source code to change product information.

3. PRODUCT DATA STRUCTURE

Create a structured product model with fields such as:

id
name
slug
category
subcategory
shortDescription
description
price
compareAtPrice
discount
currency
images
thumbnail
features
whatsIncluded
requirements
compatibility
licenseType
licenseDuration
version
deliveryMethod
tags
status
featured
bestSeller
newProduct
stockStatus
whatsappMessage
createdAt
updatedAt

All fields must be editable.

Allow multiple product images per product.

4. PRODUCT IMAGES

Create professional original visual representations for products where authorized source imagery is unavailable or cannot be reused.

Do NOT simply use random stock photographs.

The visual style should match the actual product category.

For example:

Google Merchant tools:
Create a professional SaaS dashboard/product-feed themed visual.

SEO tools:
Create a professional SEO analytics/dashboard themed visual.

Product feed tools:
Create a product catalogue/feed visualization.

Email marketing tools:
Create a professional email automation/dashboard visual.

Shopify tools:
Create a modern ecommerce dashboard/store-management visual.

Security tools:
Create a professional cybersecurity/interface visual.

Themes:
Create a polished ecommerce website mockup.

Marketing tools:
Create modern marketing analytics/dashboard visuals.

Every product should have a consistent premium visual identity.

Product images should be:

High resolution

Professional

Clean

Modern

Consistent with MerchantStack branding

Suitable for product cards

Suitable for product detail pages

Responsive

Free from unnecessary watermarks

Where the source provides an image that MerchantStack is authorized to use, preserve the relevant product identity instead of replacing it unnecessarily.

5. PRODUCT DESCRIPTIONS

Create polished, professional product descriptions based on the verified information available for each product.

Do not fabricate technical specifications, integrations, certifications, guarantees, or capabilities that are not supported by the source information.

Each product page should contain:

Overview

A concise explanation of what the product is.

Key Features

Use clean feature cards or bullet points.

What's Included

Clearly show what the customer receives.

Compatibility

Show supported platforms where known.

Requirements

Show requirements where known.

License

Show license information where available.

Delivery

Explain how the digital product is delivered.

Frequently Asked Questions

Create useful FAQs only from information that can reasonably be supported.

Every section must be editable from the admin dashboard.

6. HOMEPAGE

Create a premium homepage.

Hero:

Commerce infrastructure for modern businesses.

Supporting text:

Discover software, merchant tools, digital resources and growth solutions built to help modern businesses sell, optimize and scale online.

Buttons:

Explore Products

Talk to Us

Below the hero:

Featured Products

Show 6–8 products.

Browse by Category

Create visually attractive category cards for:

Google Merchant

SEO

Product Feeds

Shopify

Marketing

Email Marketing

Themes

Analytics

Security

Digital Resources

Why MerchantStack?

Use three or four strong value propositions:

Curated Solutions
Tools selected for modern commerce.

Fast Digital Delivery
Get access to your purchased digital products quickly.

Commerce-Focused
Solutions designed around ecommerce and online growth.

Human Support
Customers can contact MerchantStack directly through WhatsApp.

Popular Products

Display bestselling products.

Platforms We Support

Create a visual section for platforms such as:

Google
Shopify
Pinterest
TikTok Shop
Meta

Do not imply official affiliation with these companies unless verified.

Final CTA

Ready to upgrade your commerce stack?

Explore the Marketplace

7. SHOP PAGE

Create a full marketplace/shop page.

Features:

Search

Category filters

Price filters

Sorting

Featured filter

Bestseller filter

New products filter

Tags

Responsive product grid

Sorting options:

Featured

Popular

Newest

Price: Low to High

Price: High to Low

Product cards should display:

Product image

Product name

Category

Short description

Current price

Compare-at price

Discount

Bestseller/New badge

Add to Cart button

8. PRODUCT DETAIL PAGE

Create a premium product detail page.

Layout:

Left:
Large product image/gallery.

Right:
Product name
Rating/review placeholder
Short description
Price
Discount
License information
Add to Cart button
Buy via WhatsApp button

Below:

Overview
Features
What's Included
Compatibility
Requirements
Delivery
FAQ
Related Products

Include breadcrumbs.

Example:

Home → SEO Tools → SEO Tool

9. CART SYSTEM

Create a fully functional shopping cart.

Customers should be able to:

Add products

Remove products

Change quantity

View subtotal

View discounts

View total

Continue shopping

Proceed to WhatsApp

Persist cart data during the browsing session.

10. WHATSAPP CHECKOUT

The primary checkout method should be WhatsApp.

When the customer clicks:

Proceed to WhatsApp

generate a structured WhatsApp message automatically.

Example:

Hello MerchantStack,

I would like to purchase the following products:

Product: Google Merchant Solution
Price: $150

Product: SEO Tool
Price: $75

Subtotal: $225

Order ID: MS-XXXXX

Please provide payment and delivery instructions.

Thank you.

The WhatsApp link should dynamically generate the message based on the actual cart contents.

Make the WhatsApp phone number editable from the admin/settings dashboard.

Do NOT hardcode the phone number into multiple components.

Store it in one global configuration setting.

11. ORDER MANAGEMENT

Create an order record whenever a customer proceeds to WhatsApp.

Store:

Order ID

Customer name if provided

Customer phone

Products

Quantities

Prices

Total

Date

Order status

Payment status

Delivery status

WhatsApp conversation status

Order statuses:

Pending
Contacted
Payment Pending
Paid
Processing
Delivered
Completed
Cancelled

Create an admin order-management dashboard.

12. ADMIN DASHBOARD

Create a secure admin dashboard.

Dashboard sections:

Overview

Show:

Total products

Active products

Featured products

Orders

Pending orders

Completed orders

Revenue placeholder/recorded revenue

Popular products

Products

Full CRUD management.

Categories

Create/edit/delete categories.

Orders

View and manage orders.

Customers

View customer information associated with orders.

Settings

Allow editing:

Brand name

Logo

WhatsApp number

Currency

Store email

Social links

Contact information

Homepage content

Footer content

13. PRODUCT EDITOR

Make the product editor extremely user friendly.

Use a professional form with sections:

Basic Information
Pricing
Images
Description
Features
What's Included
Compatibility
Requirements
License
Delivery
SEO
Marketing
Visibility

Allow image upload and image replacement.

Add a live product preview where useful.

Changes should update the storefront automatically.

14. SEO

Every product must have editable:

SEO title

Meta description

URL slug

Keywords/tags

Open Graph title

Open Graph description

Social image

Generate clean URLs such as:

/products/google-merchant-solution

/categories/seo-tools

/products/seo-tool

Implement:

Sitemap

Robots.txt

Canonical URLs

Product structured data where appropriate

Breadcrumb structured data

Organization structured data

15. SEARCH

Create fast global product search.

Search by:

Product name

Category

Description

Tags

Features

Display relevant results as the user types.

Include an attractive search results page.

16. RELATED PRODUCTS

On every product page, automatically show related products based on:

Category

Tags

Product type

Example:

If someone views an SEO product, show other SEO and marketing products.

17. DESIGN SYSTEM

Use a premium technology-company visual style.

Do NOT copy Gumroad.

Do NOT copy the exact visual design of the reference websites.

Create an original MerchantStack identity.

Design characteristics:

Clean

Premium

Minimal

Modern

Trustworthy

Professional

SaaS-inspired

Excellent whitespace

Strong typography

Subtle animations

Rounded cards

High-quality product imagery

Use a sophisticated neutral base with a strong brand accent.

Make sure the design looks excellent on:

Desktop
Tablet
Mobile

18. MOBILE EXPERIENCE

The mobile experience must be excellent.

Optimize:

Navigation

Product cards

Search

Filters

Product pages

Cart

WhatsApp checkout

Admin dashboard

The WhatsApp CTA should remain highly visible on mobile.

19. IMPORTANT CONTENT RULES

Do not invent claims.

Do not claim MerchantStack is officially partnered with Google, Shopify, Pinterest, TikTok, Meta or any other company unless verified.

Use wording such as:

"Compatible with"
"Works with"
"Tools for"
"Solutions for"

where appropriate.

Only use product information and assets that MerchantStack is authorized to reproduce or sell.

Where information is missing, leave the field editable rather than making up specifications.

20. DATA ARCHITECTURE

Do not hardcode products into React components.

Use a proper database-backed product catalogue.

Separate:

Products
Categories
Orders
Customers
Settings
Reviews
FAQs
Product Images

Use clean relationships between these entities.

Make the architecture scalable so hundreds or thousands of products can eventually be added.

21. INITIAL PRODUCT IMPORT

Populate the initial catalogue with the strongest relevant products that can legitimately be sourced from the provided references.

Prioritize products related to:

Google Merchant
SEO
Product Feeds
Shopify
Marketing
Email
Analytics
Themes
Security
Ecommerce

Do not create duplicate products.

Clean up product names and descriptions so the catalogue feels consistent.

Normalize pricing and currency formatting.

Where the source contains inconsistent information, create an editable field and flag it for administrator review.

22. IMPORTANT: EVERYTHING MUST BE EDITABLE

This is one of the most important requirements.

I do NOT want a website where I need to edit the source code every time I want to change a product.

I need to be able to change:

Product name
Product image
Price
Discount
Description
Features
Category
Tags
License
Compatibility
Requirements
Delivery information
SEO information
Featured status
Bestseller status
WhatsApp message
Availability

from the admin dashboard.

Build this as a real content-management system.

23. FINAL QUALITY REQUIREMENT

Before considering the project complete:

Test every product page.

Test search.

Test category filtering.

Test cart.

Test quantity changes.

Test product removal.

Test WhatsApp checkout.

Test dynamic WhatsApp messages.

Test responsive design.

Test admin product editing.

Test image replacement.

Test price updates.

Test product visibility.

Test SEO fields.

Test navigation.

Test all buttons and links.

There should be no placeholder buttons that appear functional but do nothing.

The final result should feel like a real commercial software marketplace, not a demo or template.

Build the foundation so MerchantStack can eventually scale into a large ecommerce/software marketplace.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://merchantstack.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aac964f5-d0ab-4792-8e5d-75dcd48035ce).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
