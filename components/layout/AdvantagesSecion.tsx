export default function AdvantagesSection() {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-16 text-gray-800">Our Advantages</h1>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <h1 className="font-semibold mb-4 text-lg dark:text-gray-800">Premium Ingredients</h1>
              <p className="text-gray-600 font-josefin">
                Locally sourced ingredients from New Zealand, ensuring quality from the source
              </p>
            </div>
            <div className="text-center">
              <h1 className="font-semibold mb-4 text-lg dark:text-gray-800">Strict quality control</h1>
              <p className="text-gray-600 font-josefin">
                Full-process quality tracking to ensure product safety
              </p>
            </div>
            <div className="text-center">
              <h1 className="font-semibold mb-4 text-lg dark:text-gray-800">Innovative technology/process</h1>
              <p className="text-gray-600 font-josefin">
                Using advanced production technology to retain nutritional value without any additives
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }