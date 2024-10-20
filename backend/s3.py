from minio import Minio
from minio.error import S3Error
from datetime import timedelta


class PhotoService:
    def __init__(self):
        self.minio_client = Minio(
            "192.168.10.57:9000",
            access_key="sWXNKuYmTYDRFcImedsE",
            secret_key="S60GTgrDw1ed8SXioV2OcBxuMsF1nBOTjBY3zyYR",
            secure=False
        )
        self.bucket_name = "photos"
        
    async def list_photos(self):
        try:
            # List all objects in the bucket
            objects = self.minio_client.list_objects(self.bucket_name)
            photo_urls = []
            
            # Generate presigned URLs for each object
            for obj in objects:
                try:
                    # Generate a presigned URL that's valid for 1 hour
                    url = self.minio_client.presigned_get_object(
                        self.bucket_name,
                        obj.object_name,
                        expires=timedelta(hours=1)
                    )
                    photo_urls.append({
                        'url': url,
                        'name': obj.object_name,
                        'size': obj.size,
                        'last_modified': obj.last_modified.isoformat()
                    })
                except Exception as e:
                    print(f"Error generating presigned URL for {obj.object_name}: {str(e)}")
                    continue
                    
            return photo_urls
        except S3Error as exc:
            raise Exception(f"Error retrieving photos: {str(exc)}")
            
    async def upload_photo(self, file_obj, filename):
        try:
            self.minio_client.put_object(
                self.bucket_name,
                filename,
                file_obj,
                length=-1,
                part_size=10*1024*1024
            )
            return True
        except S3Error as exc:
            raise Exception(f"Error uploading photo: {str(exc)}")