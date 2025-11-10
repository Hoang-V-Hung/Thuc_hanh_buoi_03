export default function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // Quan trọng: Plugin của Reanimated phải ở cuối cùng
            'react-native-reanimated/plugin',
        ],
    };
};