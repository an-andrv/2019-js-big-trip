const path = require(`path`);
// const HtmlWebpackPlugin = require(`html-webpack-plugin`);

module.exports = {
  mode: `development`, // Режим сборки
  entry: `./src/main.js`, // Точка входа приложения
  output: { // Настройка выходного файла
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  devtool: `source-map`,

  // module: { // Расширяем функциональность лоадерами
  //   rules: [{
  //     test: /\.js$/, // Проверка типов файлов, над которыми будет работать лоадерами
  //     use: `babel-loader` // Лоадер, который будет применен
  //   }]
  // },
  // plugins: [ // Расширяем функциональность плагинами
  //   new HtmlWebpackPlugin({ // Создаем инстанс плагина
  //     template: `./src/index.html`// …передав в него необходимые ему параметры
  //   })
  // ],
  devServer: {
    contentBase: path.join(__dirname, `public`), // Где искать сборку
    publicPath: `https://localhost:8080/`, // Веб адрес сборки
    hot: true, // Автоматическая перезагрузка страницы
    compress: true // Сжатие
  }
};
