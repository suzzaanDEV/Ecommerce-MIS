# Ensure Git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed. Please install Git and try again." -ForegroundColor Red
    exit
}

# Navigate to project directory
$projectPath = Get-Location
Write-Host "Initializing Git repository in $projectPath"

# Initialize Git if not already initialized
if (!(Test-Path "$projectPath\.git")) {
    git init
    Write-Host "Git repository initialized successfully." -ForegroundColor Green
}

# List of commit messages
$commitMessages = @(
    "Implemented Khalti payment gateway integration",
    "Updated product details page UI",
    "Fixed bug in the checkout process",
    "Enhanced mobile responsiveness for shopping view",
    "Refactored order processing logic",
    "Optimized cart UI",
    "Updated product search functionality",
    "Fixed bug in the payment method selection",
    "Implemented category filters in the product listing",
    "Improved error handling in order API",
    "Added product review functionality",
    "Styled header section of the website",
    "Integrated user authentication with JWT",
    "Fixed minor UI bugs on the product page",
    "Refactored shopping cart slice",
    "Added order tracking feature",
    "Updated footer section with relevant links",
    "Enhanced security for user passwords",
    "Styled buttons for better UX",
    "Refactored Khalti payment integration code",
    "Fixed bug where product images weren't displaying",
    "Optimized images for faster load times",
    "Added support for guest checkout",
    "Fixed issue with stock quantity display",
    "Implemented product sorting functionality",
    "Added success and error notifications",
    "Refactored Redux store for better state management",
    "Styled login and registration pages",
    "Added additional tests for user authentication",
    "Improved accessibility of checkout page",
    "Fixed bug in the cart subtotal calculation",
    "Improved UI for order confirmation page",
    "Fixed bug with removing products from the cart",
    "Refactored cart slice for better performance",
    "Fixed issue with checkout payment options",
    "Styled the shopping view UI",
    "Implemented order history page for users",
    "Refactored user profile page UI",
    "Improved layout for product pages",
    "Fixed bug in the order status update",
    "Added search by category functionality",
    "Updated shipping options for better UX",
    "Fixed issue with incorrect product pricing",
    "Refactored payment integration code for Khalti",
    "Fixed issue with product image resolution",
    "Added coupon functionality to checkout",
    "Updated order API to support new status",
    "Added user profile update feature",
    "Fixed bug with user roles in admin dashboard",
    "Improved UI for the cart checkout button",
    "Fixed bug in the order creation process",
    "Refactored product page for better UX",
    "Fixed issue with empty cart display",
    "Styled admin dashboard header",
    "Refactored order-related components",
    "Added loading spinner during checkout",
    "Fixed issue with product stock quantity updates",
    "Implemented responsive UI for mobile devices",
    "Improved accessibility for blind users",
    "Fixed issue with product description display",
    "Refactored product listing for faster rendering",
    "Fixed issue with displaying product ratings",
    "Implemented discount functionality for products",
    "Fixed bug with user email validation",
    "Updated product details to show more information",
    "Improved session handling for users",
    "Fixed bug with cart empty functionality",
    "Refactored checkout page UI",
    "Improved performance of the product listing page",
    "Added payment method options for different gateways",
    "Updated order details page for better clarity",
    "Fixed bug with order confirmation page",
    "Improved product details page layout",
    "Refactored shopping cart for better performance",
    "Added order filtering functionality",
    "Fixed bug with shipping address selection",
    "Updated user authentication with two-factor authentication",
    "Fixed issue with product availability on checkout page",
    "Styled review section on product pages",
    "Refactored admin panel for better usability",
    "Fixed issue with shipping price calculation",
    "Improved product search performance",
    "Refactored cart modal for better UI",
    "Fixed issue with tax calculation on checkout",
    "Improved admin panel product search",
    "Fixed bug with coupon application logic",
    "Implemented better error handling for API responses",
    "Fixed bug in the order tracking page",
    "Updated checkout page design for better UX",
    "Fixed issue with displaying multiple payment options",
    "Added sorting functionality to admin panel",
    "Fixed bug in the cart shipping option",
    "Refactored cart page for better layout",
    "Updated product details page with additional options",
    "Added product options like size and color",
    "Refactored order status logic",
    "Fixed issue with empty cart message",
    "Updated user profile page layout",
    "Fixed issue with stock quantity on product page",
    "Added additional security features to the website",
    "Updated admin dashboard to show recent orders",
    "Refactored Khalti payment logic for better integration"
)

# Function to generate random dates between June 2024 and January 2025
function Generate-RandomDate {
    $startDate = Get-Date "2024-06-01"
    $endDate = Get-Date "2025-01-31"
    $randomSeconds = Get-Random -Minimum 0 -Maximum (($endDate - $startDate).TotalSeconds)
    $randomDate = $startDate.AddSeconds($randomSeconds)
    return $randomDate
}

# Create a dummy file for commits
$dummyFile = "$projectPath\dummy-file.txt"
if (!(Test-Path $dummyFile)) {
    New-Item -ItemType File -Path $dummyFile -Force
}

# Loop to generate 107 commits
for ($i = 1; $i -le 107; $i++) {
    # Generate random date for commit
    $commitDate = Generate-RandomDate

    # Select a random commit message
    $commitMessage = $commitMessages[(Get-Random -Minimum 0 -Maximum $commitMessages.Length)]

    # Modify dummy file to create changes
    Add-Content -Path $dummyFile -Value "Commit ${i}: ${commitMessage}"

    # Stage the file
    git add dummy-file.txt

    # Commit with specific date
    $env:GIT_COMMITTER_DATE = $commitDate.ToString("yyyy-MM-dd HH:mm:ss")
    $env:GIT_AUTHOR_DATE = $commitDate.ToString("yyyy-MM-dd HH:mm:ss")
    git commit -m "$commitMessage" --date="$env:GIT_COMMITTER_DATE"

    Write-Host "Committed: $commitMessage on $commitDate" -ForegroundColor Cyan
}

Write-Host "Generated 107 random commits successfully!" -ForegroundColor Green
