import os
from icrawler.builtin import GoogleImageCrawler

def download_images(keyword, limit=10, output_dir='images'):
    """
    Downloads images from Google based on a given keyword.

    Args:
        keyword (str): The search term for the images.
        limit (int): The maximum number of images to download.
        output_dir (str): The directory to save the images.
    """
    # Create the directory for the images if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    google_crawler = GoogleImageCrawler(
        feeder_threads=1,
        parser_threads=1,
        downloader_threads=4,
        storage={'root_dir': output_dir}
    )

    google_crawler.crawl(keyword=keyword, max_num=limit)
    print(f"Downloaded {limit} images for '{keyword}' to the '{output_dir}' directory.")

if __name__ == "__main__":
    search_query = "People"
    num_images = 20
    download_images(search_query, limit=num_images)
    print("Image download completed.")