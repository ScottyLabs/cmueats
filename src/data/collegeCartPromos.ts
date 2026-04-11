import furnitureImg from '../assets/collegecart/furniture.png';
import electronicsImg from '../assets/collegecart/electronics.png';
import clothingImg from '../assets/collegecart/clothing.png';
import schoolImg from '../assets/collegecart/school.png';
import appliancesImg from '../assets/collegecart/appliances.png';

export interface ICollegeCartPromo {
    category: string;
    tagline: string;
    image: string;
    url: string;
}

const collegeCartPromos: ICollegeCartPromo[] = [
    {
        category: 'Furniture',
        tagline: 'Moving out? Sell your furniture to fellow students.',
        image: furnitureImg,
        url: 'https://collegecart.org',
    },
    {
        category: 'Electronics',
        tagline: 'Upgrade your setup — buy & sell tech on campus.',
        image: electronicsImg,
        url: 'https://collegecart.org',
    },
    {
        category: 'Clothing',
        tagline: 'Find CMU merch and more from students nearby.',
        image: clothingImg,
        url: 'https://collegecart.org',
    },
    {
        category: 'Textbooks',
        tagline: "Don't overpay — get textbooks from classmates.",
        image: schoolImg,
        url: 'https://collegecart.org',
    },
    {
        category: 'Appliances',
        tagline: 'Graduating? Pass your appliances to the next class.',
        image: appliancesImg,
        url: 'https://collegecart.org',
    },
];

export default collegeCartPromos;
