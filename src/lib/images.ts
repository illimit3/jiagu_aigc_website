interface Image {
  id: string;
  url: string;
  title: string;
  userId: string;
  createdAt: string;
}

// In-memory storage for demo purposes
let images: Image[] = [];

export const imageStore = {
  getAll: () => images,
  add: (image: Image) => {
    images = [image, ...images];
    return image;
  },
  delete: (id: string) => {
    images = images.filter(img => img.id !== id);
  }
};