using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Omanosaura.Data;
using omanosaura.Models;
using System.Globalization;

namespace omanosaura.Controllers
{
  public class TripsController : Controller
  {
    private readonly OmanosauraContext _context;

    public TripsController(OmanosauraContext context)
    {
      _context = context;
    }

    // GET: Trips
    public async Task<IActionResult> Index()
    {
      Console.WriteLine(CultureInfo.CurrentCulture);
      return View(await _context.Trip.ToListAsync());
    }

    // GET: Trips/Details/5
    public async Task<IActionResult> Details(int? id)
    {
      if (id == null)
      {
        return NotFound();
      }

      var trip = await _context.Trip
          .FirstOrDefaultAsync(m => m.Id == id);
      if (trip == null)
      {
        return NotFound();
      }

      return View(trip);
    }

    // GET: Trips/Create
    public IActionResult Create()
    {
      return View();
    }

    // POST: Trips/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,Kind,TitleEn,TitleAr,LocationEn,LocationAr,Location,AboutEn,AboutAr,Itinerary,PriceBaisa")] Trip trip)
    {
      if (ModelState.IsValid)
      {
        _context.Add(trip);
        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
      }
      return View(trip);
    }

    // GET: Trips/Edit/5
    public async Task<IActionResult> Edit(int? id)
    {
      if (id == null)
      {
        return NotFound();
      }

      var trip = await _context.Trip.FindAsync(id);
      if (trip == null)
      {
        return NotFound();
      }
      return View(trip);
    }

    // POST: Trips/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind("Id,Kind,TitleEn,TitleAr,LocationEn,LocationAr,Location,AboutEn,AboutAr,Itinerary,PriceBaisa")] Trip trip)
    {
      if (id != trip.Id)
      {
        return NotFound();
      }

      if (ModelState.IsValid)
      {
        try
        {
          _context.Update(trip);
          await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
          if (!TripExists(trip.Id))
          {
            return NotFound();
          }
          else
          {
            throw;
          }
        }
        return RedirectToAction(nameof(Index));
      }
      return View(trip);
    }

    // GET: Trips/Delete/5
    public async Task<IActionResult> Delete(int? id)
    {
      if (id == null)
      {
        return NotFound();
      }

      var trip = await _context.Trip
          .FirstOrDefaultAsync(m => m.Id == id);
      if (trip == null)
      {
        return NotFound();
      }

      return View(trip);
    }

    // POST: Trips/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
      var trip = await _context.Trip.FindAsync(id);
      if (trip != null)
      {
        _context.Trip.Remove(trip);
      }

      await _context.SaveChangesAsync();
      return RedirectToAction(nameof(Index));
    }

    private bool TripExists(int id)
    {
      return _context.Trip.Any(e => e.Id == id);
    }
  }
}
