# Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview of Community Short.io n8n Node](#overview-of-community-shortio-n8n-node)
- [Bugs/Contributing/Feature Request](#bugscontributingfeature-request)
- [Documentation](#documentation)
  - [Installation](#installation)
  - [Credentials](#credentials)
  - [Links](#links)
    - [List Links](#list-links)
    - [Get Link Info](#get-link-info)
    - [Create Link](#create-link)
    - [Update Existing Link](#update-existing-link)
    - [Delete Link](#delete-link)
    - [Generate QR For Link](#generate-qr-for-link)
  - [Statistics](#statistics)
    - [Get Link Statistics](#get-link-statistics)
    - [Get Domain Statistics](#get-domain-statistics)

# Overview of Community Short.io n8n Node

I have no affiliation with short.io beyond being a user. I work for n8n but this is not an official node.

# Bugs/Contributing/Feature Request

If you have a bug to report or a feature request, please [submit a GitHub issue](https://github.com/liamdmcgarrigle/n8n-nodes-shortio/issues/new) with as much detail as you're able to give.

# Documentation

## Installation

This is now available on cloud as a verified community node. Simply search for shortio in the node panel.

Or follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

To use this node you will need to set up short.io credentials with a key from short.io. You also will need an account and may need a paid account.

1. Go to https://app.short.io/settings/integrations/api-key and click on "Create API Key"
   ![Screenshot1](/readme_files/step-1.jpeg)

2. Add a description, pick the domain to use, and press "Create"
   ![Screenshot2](/readme_files/step-2.jpeg)

3. Copy your new token. It will only be shown once

4. Go to the credential page in n8n, in add credentials add "Short.io API", then paste in your token. Then add the domain you chose in the previous step and press save
   ![Screenshot3](/readme_files/step-3.png)

## Links

### List Links

Get a list of your short links. These will only be links from the domain in your credential.

You will need to choose how many results are returned. Anything over 150 is automatically paginationed.

You can filter the results by adding:

- **Before date**: returns links before the listed date
- **After date**: returns links after the listed date
- **Date Sort Order**: changes the order the links are in based on the date

### Get Link Info

Get link details from the domain in your credential and the path.

### Create Link

Create a link. There are many options available in the additional fields:

- **Path**: Custom path for the short link
- **Folder**: Assign the link to a folder (select from list or enter folder ID)
- **Allow Duplicates**: Allow multiple links with the same original URL
- **Title**: Title shown in the short.io admin panel
- **Expiration settings**: Set expiry date and redirect URL for expired links
- **Device-specific URLs**: Separate URLs for iPhone and Android users
- **Cloaking**: Hide the original URL in the browser address bar
- **Redirect Type**: Choose HTTP redirect code (301, 302, etc.)
- **Password**: Password-protect the link (requires Personal plan)
- **UTM Parameters**: Add tracking parameters (source, medium, campaign, term, content)
- **Tags**: Add tags to organize your links

### Update Existing Link

You can update an existing short link by using the path or the link `idString`.
You can change anything about the link including the full long URL and folder assignment.

### Delete Link

You can delete an existing short link by using the path or the link `idString`.

### Generate QR For Link

Generate a QR code image for any short link. You can identify the link by path or `idString`.

Options available:

- **Color**: QR code foreground color
- **Background Color**: QR code background color
- **Size**: QR code size (1-99)
- **Type**: Image format (PNG or SVG)

The operation returns binary data that can be used with other n8n nodes (e.g., save to file, send via email, upload to cloud storage).

## Statistics

Get detailed analytics for your links and domain.

### Get Link Statistics

Get detailed statistics for a specific link. Identify the link by path or `idString`.

**Period options:**

- Today
- Yesterday
- Last 7 Days
- Last 30 Days
- Last Month
- All Time
- Custom (specify start and end dates)

**Additional options:**

- **Clicks Chart Interval**: Data granularity for the clicks chart (hour, day, week, month)
- **Skip Top Records**: Skip top records like referer, browser, and country breakdowns

Returns detailed statistics including total clicks, human clicks, click trends, and breakdowns by referer, browser, country, and more.

### Get Domain Statistics

Get detailed statistics for your entire domain (as configured in your credentials).

**Period options:**

- Today
- Yesterday
- Last 7 Days
- Last 30 Days
- Last Month
- All Time
- Custom (specify start and end dates)

**Additional options:**

- **Clicks Chart Interval**: Data granularity for the clicks chart (hour, day, week, month)

Returns domain-wide statistics including total clicks, link counts, clicks per link averages, and breakdowns by referer, browser, country, and more.
